from dotenv import load_dotenv
import os
import psycopg2
# Load environment variables from the .env file
load_dotenv()
import MySQLdb

# PostgreSQL connection configuration
db_params = {
    'host': os.getenv("DATABASE_HOST"),
    'port': int(os.getenv("DATABASE_PORT")),
    'user': os.getenv("DATABASE_USERNAME"),
    'password': os.getenv("DATABASE_PASSWORD"),
    'database': os.getenv("DATABASE_USERNAME")
}

# Connect to the PostgreSQL database
connection = psycopg2.connect(**db_params)

# Create a cursor object to execute queries
cursor = connection.cursor()

#Creates team table
try:
    # SQL query to drop the table if it exists
    drop_table_query = "DROP TABLE IF EXISTS teams;"

    # Execute the query to drop the table
    cursor.execute(drop_table_query)

    # SQL query to create a table
    # Position can be 0 = GK, 1 = D, 2 = F
    create_table_query = """
    CREATE TABLE teams (
        id VARCHAR(3) NOT NULL primary key,
        name VARCHAR(100) NOT NULL,
        stadium_name VARCHAR(100) NOT NULL,
        hexcode VARCHAR(7) NOT NULL,
        discord_emoji_id INTEGER

    );
    """

    # Execute the query to create the table
    cursor.execute(create_table_query)

    # Commit the changes
    connection.commit()

    print("Table 'teams' created successfully.")

except Exception as e:
    print(f"Error: {e}")


#Creates player table
try:
    # SQL query to drop the table if it exists
    drop_table_query = "DROP TABLE IF EXISTS players;"

    # Execute the query to drop the table
    cursor.execute(drop_table_query)

    # SQL query to create a table
    # Position can be 0 = GK, 1 = D, 2 = F
    create_table_query = """
    CREATE TABLE players (
        id INTEGER PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position SMALLINT NOT NULL,
        type SMALLINT NOT NULL,
        team_id VARCHAR(3) NOT NULL,
        discord_id INTEGER,
        FOREIGN KEY (team_id)
        REFERENCES teams (id)

    );
    """

    # Execute the query to create the table
    cursor.execute(create_table_query)

    # Commit the changes
    connection.commit()

    print("Table 'players' created successfully.")

except Exception as e:
    print(f"Error: {e}")

cursor.close()
connection.close()
