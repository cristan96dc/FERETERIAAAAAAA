import xml.etree.ElementTree as ET

def leer_ta(path='api_afip/TA.xml'):
    tree = ET.parse(path)
    root = tree.getroot()
    token = root.find('credentials/token').text
    sign = root.find('credentials/sign').text

    print("EL TOKEN ES:", token[:20])
    print("LA FIRMA ES:", sign[:20])
    return token, sign
def consultar_ultimo_comprobante(token, sign, cuit_emisor, pto_vta=1, cbte_tipo=6):
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
          <PtoVta>{pto_vta}</PtoVta>
          <CbteTipo>{cbte_tipo}</CbteTipo>
        </FECompUltimoAutorizado>
      </soap:Body>
    </soap:Envelope>
    """

    response = requests.post(url, data=xml.encode('utf-8'), headers=headers)
    root = ET.fromstring(response.text)
    ns = {'soap': 'http://schemas.xmlsoap.org/soap/envelope/', 'ns': 'http://ar.gov.afip.dif.FEV1/'}
    ult = root.find('.//ns:CbteNro', ns)
    return int(ult.text)

