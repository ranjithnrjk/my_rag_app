import 'dotenv/config';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { promises as fspromises } from 'fs';

// Google embedding models
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

try {
    const text = await fspromises.readFile('./info.txt', 'utf-8');

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
        separators: ['\n\n', '\n', '.', ' ', ''] //default settings
    });

    const output = await splitter.createDocuments([text]);

    const sbApiKey = process.env.SUPABASE_PRIVATE_KEY;
    const sbUrl = process.env.SUPABASE_URL;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!sbUrl || !sbApiKey || !googleApiKey) {
        throw new Error("Missing required environment variables. Please check SUPABASE_URL, SUPABASE_PRIVATE_KEY, and GOOGLE_API_KEY");
    }

    const client = createClient(sbUrl, sbApiKey);

    await SupabaseVectorStore.fromDocuments(
        output,
        new GoogleGenerativeAIEmbeddings({
            googleApiKey: googleApiKey,
            modelName: "text-embedding-004",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "Document title",
        }),
        {
            client,
            tableName: "documents",
            queryName: "match_documents"
        }
    );
    console.log("Document saved to Supabase");
} catch (err) {
    console.log(err)
}