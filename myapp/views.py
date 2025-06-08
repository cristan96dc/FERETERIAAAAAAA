
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Proveedor, Producto
from .serializers import ProveedorSerializer, ProductoSerializer, CantidadSerializer



class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    @action(detail=True, methods=['post'])
    def cambiar_cantidad(self, request, pk=None):
        producto = self.get_object()
        nueva_cantidad = request.data.get('cantidad')
        if nueva_cantidad is not None:
            try:
                nueva_cantidad = int(nueva_cantidad)
            except ValueError:
                return Response({'error': 'Cantidad debe ser un número entero'}, status=status.HTTP_400_BAD_REQUEST)
            producto.cantidad_disponible = nueva_cantidad
            producto.save()
            return Response({'status': 'cantidad actualizada', 'cantidad': producto.cantidad_disponible})
        return Response({'error': 'Cantidad no proporcionada'}, status=status.HTTP_400_BAD_REQUEST)

class CantidadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = CantidadSerializer
    
from rest_framework import viewsets
from .models import Venta
from .serializers import VentaSerializer
from .filters import VentaFilter
from django_filters.rest_framework import DjangoFilterBackend

class VentaViewSet(viewsets.ModelViewSet):  # Esto habilita POST, GET, PUT, DELETE
    queryset = Venta.objects.all().order_by('-fecha_venta')
    serializer_class = VentaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = VentaFilter
    
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def tipo_producto_choices(request):
    choices = [{'value': choice[0], 'label': choice[1]} for choice in Producto.TIPO_PRODUCTO_CHOICES]
    return Response(choices)
from django.http import JsonResponse

def hola_desde_django(request):
    return JsonResponse({"mensaje": "Hola desde Django "})
# ventas/filters.py
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Venta
from .serializers import VentaSerializer
from .filters import VentaFilter

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha_venta')
    serializer_class = VentaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = VentaFilter        
    ######################################
    from django.http import JsonResponse, HttpResponse
import xml.etree.ElementTree as ET
import requests
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import json

# Ruta al TA.xml
TA_PATH = 'api_afip/TA.xml'

def home_view(request):
    return HttpResponse("Bienvenido al sistema de facturación.")

def leer_ta(path=TA_PATH):
    tree = ET.parse(path)
    root = tree.getroot()
    token = root.find('credentials/token').text
    sign = root.find('credentials/sign').text
    return token, sign

def consultar_ultimo_comprobante(token, sign, cuit_emisor, punto_vta, tipo_cbte):
    url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx"
    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado"
    }
    xml = f"""
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <FECompUltimoAutorizado xmlns="http://ar.gov.afip.dif.FEV1/">
          <Auth>
            <Token>{token}</Token>
            <Sign>{sign}</Sign>
            <Cuit>{cuit_emisor}</Cuit>
          </Auth>
          <PtoVta>{punto_vta}</PtoVta>
          <CbteTipo>{tipo_cbte}</CbteTipo>
        </FECompUltimoAutorizado>
      </soap:Body>
    </soap:Envelope>
    """
    response = requests.post(url, data=xml.encode('utf-8'), headers=headers)
    root = ET.fromstring(response.text)
    ns = {'ns': 'http://ar.gov.afip.dif.FEV1/'}
    nro = root.find('.//ns:CbteNro', ns)
    return int(nro.text)

from .models import Factura, Venta  
#####
@csrf_exempt
def emitir_factura_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Solo se acepta POST con JSON"}, status=405)

    try:
        data = json.loads(request.body)

        tipo_cbte = int(data.get("tipo_cbte", 6))  # default: factura B
        punto_vta = int(data.get("punto_venta", 1))
        doc_tipo = int(data.get("doc_tipo", 80))
        doc_nro = data.get("doc_nro", "20111111112")
        neto = float(data.get("monto_neto", 100.00))
        tributo = float(data.get("tributo", 0.00))
        iva_21 = float(data.get("iva_21", 0.00))
        iva_105 = float(data.get("iva_105", 0.00))

        token, sign = leer_ta()
        cuit_emisor = "20446870913"
        fecha = datetime.now().strftime("%Y%m%d")

        ultimo = consultar_ultimo_comprobante(token, sign, cuit_emisor, punto_vta, tipo_cbte)
        nro_cbte = ultimo + 1
        imp_total = neto + tributo + iva_21 + iva_105

        incluir_iva = tipo_cbte != 11
        iva_xml = ""
        if incluir_iva:
            if iva_21 > 0:
                iva_xml += f"""
                <AlicIva>
                  <Id>5</Id>
                  <BaseImp>{neto:.2f}</BaseImp>
                  <Importe>{iva_21:.2f}</Importe>
                </AlicIva>
                """
            if iva_105 > 0:
                iva_xml += f"""
                <AlicIva>
                  <Id>4</Id>
                  <BaseImp>{neto:.2f}</BaseImp>
                  <Importe>{iva_105:.2f}</Importe>
                </AlicIva>
                """

        xml = f"""
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <FECAESolicitar xmlns="http://ar.gov.afip.dif.FEV1/">
              <Auth>
                <Token>{token}</Token>
                <Sign>{sign}</Sign>
                <Cuit>{cuit_emisor}</Cuit>
              </Auth>
              <FeCAEReq>
                <FeCabReq>
                  <CantReg>1</CantReg>
                  <PtoVta>{punto_vta}</PtoVta>
                  <CbteTipo>{tipo_cbte}</CbteTipo>
                </FeCabReq>
                <FeDetReq>
                  <FECAEDetRequest>
                    <Concepto>1</Concepto>
                    <DocTipo>{doc_tipo}</DocTipo>
                    <DocNro>{doc_nro}</DocNro>
                    <CbteDesde>{nro_cbte}</CbteDesde>
                    <CbteHasta>{nro_cbte}</CbteHasta>
                    <CbteFch>{fecha}</CbteFch>
                    <ImpTotal>{imp_total:.2f}</ImpTotal>
                    <ImpNeto>{neto:.2f}</ImpNeto>
                    <ImpIVA>{(iva_21 + iva_105) if incluir_iva else 0.00:.2f}</ImpIVA>
                    <MonId>PES</MonId>
                    <MonCotiz>1.00</MonCotiz>
                    {"<Iva>" + iva_xml + "</Iva>" if incluir_iva else ""}
                  </FECAEDetRequest>
                </FeDetReq>
              </FeCAEReq>
            </FECAESolicitar>
          </soap:Body>
        </soap:Envelope>
        """

        url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx"
        headers = {
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": "http://ar.gov.afip.dif.FEV1/FECAESolicitar"
        }

        response = requests.post(url, data=xml.encode("utf-8"), headers=headers)
        root = ET.fromstring(response.text)
        ns = {'ns': 'http://ar.gov.afip.dif.FEV1/'}

        cae = root.find('.//ns:CAE', ns)
        f_vto = root.find('.//ns:CAEFchVto', ns)
        err = root.find('.//ns:Err', ns)

        
        Factura.objects.create(
            venta=None,
            tipo_factura=_tipo_letra(tipo_cbte),
            numero_factura=f"{punto_vta:04d}-{nro_cbte:08d}",
            codigo_autorizacion=cae.text if cae is not None else "ERROR",
            total_factura=imp_total
        )

        if cae is not None and cae.text:
            return JsonResponse({
                "cae": cae.text,
                "vencimiento": f_vto.text,
                "nro_factura": nro_cbte,
                "imp_total": imp_total,
                "success": True
            })
        elif err is not None:
            return JsonResponse({
                "error": err.find('ns:Msg', ns).text,
                "codigo": err.find('ns:Code', ns).text
            })

        return JsonResponse({"error": "Respuesta inesperada de AFIP", "raw": response.text})

    except Exception as e:
        #Si hubo error antes de obtener CAE, igual guardamos el intento fallido
        Factura.objects.create(
            venta=None,
            tipo_factura="X",
            numero_factura="ERROR",
            codigo_autorizacion=f"Fallo: {str(e)}",
            total_factura=0.00
        )
        return JsonResponse({"error": str(e)})

def _tipo_letra(cbte_tipo):
    return {
        1: 'A',
        6: 'B',
        11: 'C'
    }.get(cbte_tipo, 'X')

from rest_framework import viewsets
from rest_framework.response import Response
import json
from django.test import RequestFactory
from .views import emitir_factura_view

class EmitirFacturaViewSet(viewsets.ViewSet):
    def create(self, request):
        from .views import emitir_factura_view
        factory = RequestFactory()
        fake_request = factory.post(
            '/emitir-factura/',
            data=json.dumps(request.data),
            content_type='application/json'
        )
        response = emitir_factura_view(fake_request)
        return Response(json.loads(response.content), status=response.status_code)

from rest_framework import viewsets
from .models import Factura
from .serializers import FacturaSerializer

class FacturaViewSet(viewsets.ModelViewSet):
    queryset = Factura.objects.all().order_by('-fecha_factura')
    serializer_class = FacturaSerializer


