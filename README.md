# AI Agents (Eval, RAG, Human in the Loop)

### Development Setup

- install dependencies `npm install`
- `cp .env.example .env` & fill values

### Scripts

- `npm run eval "reddit"` (or name of any file in evals/experiments --w/o the
  `.eval.ts` part)
- to view the results of the evaluation 📈 `cd dashboard && npm run dev`
- `npm run ingest` to ingest movies db data to upstash (run it once)
- `npm run rag "find a movie about aliens"` to use movies db (uploaded to
  upstash)

> Ignore TS issues 🥲

## RAG Pipeline

1. **Document Processing**

- Text extraction: converting various file formats into plain text while
  preserving important structural information.
- Chunking: breaking down documents into smaller, manageable pieces.

2. **Embeding Generation** dense vector representations of the text 👆 that
   capture semantic meaning.
   > While OpenAI's text-embedding-ada-002 is popular, you might opt for
   > domain-specific models or newer alternatives like BGE or INSTRUCTOR. Each
   > comes with its own tradeoffs in terms of accuracy, speed, and cost.
3. **Storage & Indexing** vector databases like Pinecone, Weaviate, or FAISS
   become essential here. The choice of database and index type impacts both
   retrieval speed and accuracy. Consider factors like:

- Update frequency of your knowledge base
- Required query latency
- Scale of your data
- Cost

4. **Retrieval Process** when a query comes in, RAG follows these steps:
   1. Convert the query into an embedding using the same model used for
      documents
   2. Search the vector database for similar chunks
   3. Filter and rank the results
   4. Format the retrieved context for injection into the prompt
      > The complexity lies in optimizing each step. How many chunks should you
      > retrieve? How should you handle context length limitations? How do you
      > ensure diversity in your retrievals while maintaining relevance?

### Beyond Question Answering

- **Document Creation** RAG can help generate documents by pulling in relevant
  information from your knowledge base. This ensures consistency with existing
  documentation and reduces the chance of hallucination.
- **Fact-Checking and Verification** By comparing LLM outputs against retrieved
  information, RAG systems can verify factual accuracy and identify potential
  hallucinations.
- **Knowledge Synthesis** RAG excels at combining information from multiple
  sources to create comprehensive responses, making it valuable for research and
  analysis tasks.
- **Personalization** By incorporating user-specific or organization-specific
  knowledge, RAG enables more contextually aware and personalized interactions.

### The Challenges of RAG

- **Relevance vs. Diversity** Finding the right balance between retrieving
  highly similar chunks and maintaining enough diversity for comprehensive
  answers is an ongoing challenge. Too much focus on similarity can lead to
  redundant information, while too much diversity might introduce irrelevant
  context.
- **Context Window Management** LLMs have limited context windows, so you need
  to be strategic about how much retrieved information you include. This often
  requires sophisticated chunk selection and prompt engineering.
- **Hallucination Control** While RAG can reduce hallucination, it doesn't
  eliminate it entirely. LLMs might still blend retrieved information with their
  pretrained knowledge in unexpected ways.
- **Performance Optimization** Each component of the RAG pipeline presents
  optimization opportunities:
- Chunking strategies (size, overlap, metadata)
- Embedding model selection and fine-tuning
- Retrieval algorithms and ranking methods
- Prompt engineering for context integration
