import pandas as pd
import os

fp = os.path.dirname(os.path.realpath(__file__))

csv_dir = fp + "/fk_csvs/"


def create_table(table_name, table_fields):
    field_lines = (
        "DROP TABLE {table_name}; \nCREATE TABLE {table_name} (\n".format(
            table_name=table_name
        )
        + "id SERIAL, \n"
    )
    for field in table_fields:
        if field == "code":
            field_lines += " {} VARCHAR() UNIQUE, \n".format(field)
        elif field == "description":
            field_lines += " {} TEXT, \n".format(field)
        else:
            field_lines += " {} TEXT, \n".format(field)
    field_lines += " PRIMARY KEY (id) \n ); \n \n"
    field_string = ""
    for field in table_fields:
        field_string += field + ","
    field_string = field_string[:-1]
    field_lines += "\\copy {table_name}({field_string}) FROM {table_name}.csv WITH DELIMITER ',' CSV HEADER;".format(
        table_name=table_name, field_string=field_string
    )
    return field_lines


def alter_table(base_table, foreign_key_table, code_id):
    return "ALTER TABLE {table} ADD COLUMN {fk_table}_id INTEGER REFERENCES {fk_table}(id) ON DELETE CASCADE; \nUPDATE {table} SET {fk_table}_id = (SELECT {fk_table}.id FROM {fk_table} where {fk_table}.{code_id} = {table}.{fk_table})".format(
        table=base_table, fk_table=foreign_key_table, code_id=code_id
    )


for entry in os.scandir(csv_dir):
    if entry.path.endswith(".csv") and entry.is_file():
        df = pd.read_csv(entry, dtype=str)
        fields = df.columns.values.tolist()
        entry_name = entry.name.removesuffix(".csv")
        if "fips_code" in fields:
            code_field = "fips_code"
        else:
            code_field = "code"
        table = create_table(entry_name, fields)
        alter_statement = alter_table("nbi_raw", entry_name, code_field)

        print(table)
        print()
        print(alter_statement)
        print()
