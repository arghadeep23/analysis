import streamlit as st
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document

load_dotenv()

# Vectorising the salaries csv data
loader = CSVLoader(file_path="salaries.csv")
documents = loader.load()

# Split the text into smaller chunks
text_splitter = CharacterTextSplitter(
    separator="\n",  # or any other appropriate separator
    chunk_size=1000,  # size of each chunk in characters
    chunk_overlap=200  # overlap between chunks to maintain context
)
split_documents = []
for doc in documents:
    splits = text_splitter.split_text(doc.page_content)
    for chunk in splits:
        # Create Document object for each chunk
        split_documents.append(
            Document(page_content=chunk, metadata=doc.metadata))

# Create embeddings for each chunk
embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(split_documents, embeddings)

# Function for similarity search


def retrieve_info(query):
    similar_response = db.similarity_search(query, k=100)
    page_contents_array = [doc.page_content for doc in similar_response]
    return page_contents_array


# Setup LLMChain & prompts
# Setting up a large language model (llm)
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")
template = '''
You are a salary data expert.
    
Given the following query:
{message}

and the following context from the salary data:
{context}

Provide detailed insights based on the salary data, considering the latest trends and historical data. Make sure to highlight any significant patterns or anomalies.
'''
prompt = PromptTemplate(
    input_variables=["message", "context"],
    template=template
)

chain = LLMChain(llm=llm, prompt=prompt)


# 4. Retrieval augmented generation
def generate_response(message):
    context = retrieve_info(message)
    response = chain.run(message=message, context=context)
    return response


# Retrieval augmented generation
# message = '''
# What is the highest salary paid in the year 2024 and for which role ?
# '''
# response = generate_response(message)
# print(response)

# 5. Build an app with streamlit
def main():
    st.set_page_config(
        page_title="ML Engineer Salary Analysis", page_icon=":bird:")

    st.header("Generates insights on the trained data :bird:")
    message = st.text_area("customer message")

    if message:
        st.write("Generating insights...")
        result = generate_response(message)
        st.info(result)


if __name__ == '__main__':
    main()
