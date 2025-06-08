# fix_column.py

import sqlite3

# Conectarse al archivo de base de datos
conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

try:
    # Ejecutar el ALTER TABLE para agregar el campo 'cae'
    cursor.execute("ALTER TABLE myapp_factura ADD COLUMN cae VARCHAR(14);")
    print("✅ Columna 'cae' agregada correctamente.")
except Exception as e:
    print(f"⚠️ Error al agregar la columna 'cae': {e}")

# Guardar y cerrar conexión
conn.commit()
conn.close()
