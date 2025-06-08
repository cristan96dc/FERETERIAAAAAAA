from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE TABLE myapp_factura_temp AS
                SELECT id, venta_id, tipo_factura, numero_factura,
                       codigo_autorizacion, fecha_factura, total_factura,
                       exito, mensaje_error
                FROM myapp_factura;
            """,
            reverse_sql="DROP TABLE IF EXISTS myapp_factura_temp;"
        ),
        migrations.RunSQL(
            sql="DROP TABLE myapp_factura;",
            reverse_sql="CREATE TABLE myapp_factura AS SELECT * FROM myapp_factura_temp;"
        ),
        migrations.RunSQL(
            sql="ALTER TABLE myapp_factura_temp RENAME TO myapp_factura;",
            reverse_sql="DROP TABLE IF EXISTS myapp_factura;"
        ),
    ]
