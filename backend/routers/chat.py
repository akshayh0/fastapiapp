from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse
from services.langchain_service import ask_ai

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)

@router.post("/", response_model=ChatResponse)
def chatbot(request: ChatRequest):

    answer = ask_ai(request.question)

    return ChatResponse(answer=answer)