import 'dotenv/config';

// Vector store 
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

// Google embedding models
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";


const sbApiKey = process.env.SUPABASE_PRIVATE_KEY;
const sbUrl = process.env.SUPABASE_URL;
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!sbUrl || !sbApiKey || !googleApiKey) {
    throw new Error("Missing required environment variables. Please check SUPABASE_URL, SUPABASE_PRIVATE_KEY, and GOOGLE_API_KEY");
}

const client = createClient(sbUrl, sbApiKey);
const embeddings = new GoogleGenerativeAIEmbeddings({
    googleApiKey: googleApiKey,
    modelName: "text-embedding-004",
})

const vectorStore = new SupabaseVectorStore(embeddings, {
    client: client,
    tableName: "documents",
    queryName: "match_documents",
})

const retriever = vectorStore.asRetriever();

export { retriever };

// // Test the retriever functionality
// (async () => {
//     try {
//         console.log("Testing retriever...");
//         const results = await retriever.getRelevantDocuments("Who is scrimba for?");
        
//         // Log the raw results to inspect the structure
//         console.log("Raw retriever results:", results);

//         // Validate and log pageContent values
//         const validResults = results.map((doc, index) => {
//             if (typeof doc.pageContent !== 'string') {
//                 console.warn(`Document at index ${index} has invalid pageContent:`, doc.pageContent);
//                 return { ...doc, pageContent: '' }; // Replace invalid content with an empty string
//             }
//             return doc;
//         });

//         // Combine the valid pageContent values
//         const combinedResults = validResults.map(doc => doc.pageContent).join('\n\n');
//         console.log("Combined results:", combinedResults);
//     } catch (error) {
//         console.error("Error testing retriever:", error);
//     }
// })();