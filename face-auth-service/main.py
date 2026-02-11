from fastapi import FastAPI
from dbConnect import connect_to_postgres,test_postgres_connection
app = FastAPI()




@app.get("/")
async def root():
    return {"message": "Hello World"}










if __name__ == '__main__':
    test_postgres_connection()