import os
import requests
from datetime import datetime
import xml.etree.ElementTree as ET

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUTA_CSR = os.path.abspath(os.path.join(BASE_DIR, '..', 'CSR'))

def obtener_ultimo_comprobante(cuit_emisor, token, sign, punto_venta, tipo_cbte):
    url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx"
    headers = {
        'SOAPAction': 'http://ar.gov.afip.dif.FEV1/FECompUltimoAutorizado',
        'Content-Type': 'text/xml; charset=utf-8',
    }

    payload = f"""<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Header/>
  <soapenv:Body>
    <ar:FECompUltimoAutorizado>
      <ar:Auth>
        <ar:Token>{token}</ar:Token>
        <ar:Sign>{sign}</ar:Sign>
        <ar:Cuit>{cuit_emisor}</ar:Cuit>
      </ar:Auth>
      <ar:PtoVta>{punto_venta}</ar:PtoVta>
      <ar:CbteTipo>{tipo_cbte}</ar:CbteTipo>
    </ar:FECompUltimoAutorizado>
  </soapenv:Body>
</soapenv:Envelope>"""

    response = requests.post(url, headers=headers, data=payload)
    root = ET.fromstring(response.text)
    ns = {'ar': 'http://ar.gov.afip.dif.FEV1/'}

    try:
        nro = root.find('.//ar:CbteNro', ns).text
        return int(nro)
    except Exception as e:
        print("Error al obtener último comprobante:", e)
        print("Respuesta completa:")
        print(response.text)
        return None

def generar_factura_afip(cuit_cliente: str, doc_tipo: int, doc_nro: str, monto_neto: float, tributo: float, iva_21: float, iva_105: float, punto_venta: int = 12, tipo_cbte: int = 1):
    fecha_hoy = datetime.now().strftime("%Y%m%d")

    token = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8c3NvIHZlcnNpb249IjIuMCI+CiAgICA8aWQgc3JjPSJDTj13c2FhaG9tbywgTz1BRklQLCBDPUFSLCBTRVJJQUxOVU1CRVI9Q1VJVCAzMzY5MzQ1MDIzOSIgZHN0PSJDTj13c2ZlLCBPPUFGSVAsIEM9QVIiIHVuaXF1ZV9pZD0iNTcyNTkwODI4IiBnZW5fdGltZT0iMTc0ODU1NjQwNSIgZXhwX3RpbWU9IjE3NDg1OTk2NjUiLz4KICAgIDxvcGVyYXRpb24gdHlwZT0ibG9naW4iIHZhbHVlPSJncmFudGVkIj4KICAgICAgICA8bG9naW4gZW50aXR5PSIzMzY5MzQ1MDIzOSIgc2VydmljZT0id3NmZSIgdWlkPSJTRVJJQUxOVU1CRVI9Q1VJVCAyMDQ0Njg3MDkxMywgQ049bmluaSIgYXV0aG1ldGhvZD0iY21zIiByZWdtZXRob2Q9IjIyIj4KICAgICAgICAgICAgPHJlbGF0aW9ucz4KICAgICAgICAgICAgICAgIDxyZWxhdGlvbiBrZXk9IjIwNDQ2ODcwOTEzIiByZWx0eXBlPSI0Ii8+CiAgICAgICAgICAgIDwvcmVsYXRpb25zPgogICAgICAgIDwvbG9naW4+CiAgICA8L29wZXJhdGlvbj4KPC9zc28+Cg=="
    sign = "ZI8B7jCxnwMqOJoMz7UvhYk4GwL8k2ahQtchS/hfnbGAhQkuOgVWrFzv8jKXYHL+DWtGDi32svK6Hy5sTAr8VNJXQ4t/d2Dwq3jMBqtdCgRqp+WC4R8HSnC8Fp7wNURe61Z05RXLNDgHyj/PRAv5GzJHf+GnMcmDUMzDHEWLdS4="
    cuit_emisor = "20446870913"

    imp_total = monto_neto + tributo + iva_21 + iva_105

    ultimo_nro = obtener_ultimo_comprobante(cuit_emisor, token, sign, punto_venta, tipo_cbte)
    if ultimo_nro is None:
        return {"error": "No se pudo obtener el número del último comprobante"}

    cbte_desde = ultimo_nro + 1

    payload = f"""<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
  <soapenv:Header/>
  <soapenv:Body>
    <ar:FECAESolicitar>
      <ar:Auth>
        <ar:Token>{token}</ar:Token>
        <ar:Sign>{sign}</ar:Sign>
        <ar:Cuit>{cuit_emisor}</ar:Cuit>
      </ar:Auth>
      <ar:FeCAEReq>
        <ar:FeCabReq>
          <ar:CantReg>1</ar:CantReg>
          <ar:PtoVta>{punto_venta}</ar:PtoVta>
          <ar:CbteTipo>{tipo_cbte}</ar:CbteTipo>
        </ar:FeCabReq>
        <ar:FeDetReq>
          <ar:FECAEDetRequest>
            <ar:Concepto>1</ar:Concepto>
            <ar:DocTipo>{doc_tipo}</ar:DocTipo>
            <ar:DocNro>{doc_nro}</ar:DocNro>
            <ar:CbteDesde>{cbte_desde}</ar:CbteDesde>
            <ar:CbteHasta>{cbte_desde}</ar:CbteHasta>
            <ar:CbteFch>{fecha_hoy}</ar:CbteFch>
            <ar:ImpTotal>{imp_total:.2f}</ar:ImpTotal>
            <ar:ImpTotConc>0</ar:ImpTotConc>
            <ar:ImpNeto>{monto_neto:.2f}</ar:ImpNeto>
            <ar:ImpOpEx>0</ar:ImpOpEx>
            <ar:ImpTrib>{tributo:.2f}</ar:ImpTrib>
<ar:Tributos>
<ar:Tributo>
<ar:Id>99</ar:Id>
<ar:Desc>Impuesto Municipal</ar:Desc>
<ar:BaseImp>{monto_neto:.2f}</ar:BaseImp>
<ar:Alic>0.00</ar:Alic>
<ar:Importe>{tributo:.2f}</ar:Importe>
</ar:Tributo>
</ar:Tributos>
<ar:ImpIVA>{iva_21 + iva_105:.2f}</ar:ImpIVA>

            <ar:MonId>PES</ar:MonId>
            <ar:MonCotiz>1</ar:MonCotiz>
            <ar:Iva>
              <ar:AlicIva>
                <ar:Id>5</ar:Id>
                <ar:BaseImp>{monto_neto - 50:.2f}</ar:BaseImp>
                <ar:Importe>{iva_21:.2f}</ar:Importe>
              </ar:AlicIva>
              <ar:AlicIva>
                <ar:Id>4</ar:Id>
                <ar:BaseImp>50.00</ar:BaseImp>
                <ar:Importe>{iva_105:.2f}</ar:Importe>
              </ar:AlicIva>
            </ar:Iva>
          </ar:FECAEDetRequest>
        </ar:FeDetReq>
      </ar:FeCAEReq>
    </ar:FECAESolicitar>
  </soapenv:Body>
</soapenv:Envelope>
"""

    headers = {
        'SOAPAction': 'http://ar.gov.afip.dif.FEV1/FECAESolicitar',
        'Content-Type': 'text/xml; charset=utf-8',
    }

    url = "https://wswhomo.afip.gov.ar/wsfev1/service.asmx"
    print(payload)

    response = requests.post(url, headers=headers, data=payload)

    root = ET.fromstring(response.text)
    ns = {'ar': 'http://ar.gov.afip.dif.FEV1/'}

    try:
        print("=== XML devuelto por AFIP ===")
        print(response.text)

        cae = root.find('.//ar:CAE', ns).text
        fch_vto = root.find('.//ar:CAEFchVto', ns).text
        nro_cbte = root.find('.//ar:CbteDesde', ns).text

        return {
            "cae": cae,
            "vencimiento": fch_vto,
            "nro_factura": nro_cbte,
            "imp_total": imp_total,
            "success": True
        }

    except Exception as e:
        return {
            "error": "No se pudo parsear la respuesta de AFIP",
            "detalle": str(e),
            "respuesta_cruda": response.text,
            "success": False
        }

if __name__ == "__main__":
    resultado = generar_factura_afip(
        cuit_cliente="20111111112",
        doc_tipo=80,
        doc_nro="20111111112",
        monto_neto=150.00,
        tributo=7.80,
        iva_21=21.00,
        iva_105=5.25
    )
    print(resultado)
