from fastapi import FastAPI
from routers import company,job
from database import Base,engine
app = FastAPI()
print("engine is :",engine)
Base.metadata.create_all(bind=engine)
app.include_router(company.router)
app.include_router(job.router)
@app.get("/")
def read_root():
    return{"Hello": "World"}
@app.get("/about")
def read_about():
    return {"about":"this is about page"}

@app.get("/contact")
def read_contact():
    return{"contact":"this is contact page"}