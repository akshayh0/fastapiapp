import os
from dotenv import load_dotenv

from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.3-70b-versatile"
)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an AI Career Assistant. Help students with resumes, jobs, interview preparation, and career guidance."
    ),
    ("human", "{question}")
])

chain = prompt | llm


def ask_ai(question: str):
    response = chain.invoke({
        "question": question
    })

    return response.content