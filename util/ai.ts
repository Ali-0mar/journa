import { ChatGoogleGenerativeAI as Gemini, GoogleGenerativeAIEmbeddings as GeminiEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { loadQARefineChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

import {
  StructuredOutputParser,
  OutputFixingParser,
} from 'langchain/output_parsers';
import { Document } from 'langchain/document';
import { z } from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('The emotional state of the person who wrote the journal entry.'),
    subject: z.string().describe('The college subject of the journal entry (e.g., Physics, History).'),
    negative: z.boolean().describe('Does the person have a negative outlook or lack of understanding of the subject in the journal entry?'),
    summary: z.string().describe('A quick academic summary of the entry, including key points, false information, and learning resources.'),
    color: z.string().describe('A hexadecimal color code representing the person\'s understanding of the subject matter.'),
    sentimentScore: z.number().describe('Sentiment of the text rated on a scale from -10 (negative) to 10 (positive).'),
    keywords: z.string().describe('Relevant academic keywords or terms extracted from the journal entry.'),
    concepts: z.string().describe('Core academic concepts covered in the journal entry.'),
    resources: z.string().describe('Links or references related to the journal entry\'s subject for further study.'),
    incorrect_information: z.string().describe('List of incorrect academic information extracted from the journal entry.'),
  })
);

const getPrompt = async (content: any) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: `
      Analyze the following college journal entry. Your analysis should include:

      1. A general summary of the entry content and what the entry is talkin about.
      2. The mood of the person who wrote the entry.
      3. The subject of the journal entry.
      4. If the entry contains any incorrect academic information extract all of them.
      5. Keywords extracted from the entry related to the subject matter.
      6. Core academic concepts discussed in the entry.
      7. Resources where the user can learn more about the correct information or the subject matter.
      8. A hexadecimal color code representing the person's understanding of the subject matter.
      9. Sentiment of the text rated on a scale from -10 (negative) to 10 (positive).

      **Format the output as follows:**
      - summary: <Provide a summary of the entry content and what the entry talks about>
      - mood: <Mood description here>
      - subject: <Subject of the entry>
      - negative: <true/false based on whether the person lacks understanding>
      - incorrect_information: <Comma-separated incorrect academic information>
      - keywords: <Comma-separated keywords related to the entry>
      - concepts: <Comma-separated core concepts of the subject>
      - resources: <Comma-separated list of resources for further learning>
      - color: <Hexadecimal color code>
      - sentimentScore: <Numeric sentiment score>

      Make sure to accurately capture all requested information and format your response to match the instructions exactly No Matter What!.

      {format_instructions}

      Entry: {entry}`,
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyzeEntry = async (entry: any) => {
  const input = await getPrompt(entry.content);
  const model = new Gemini({ apiKey: "AIzaSyCc_2G-mFtQla6w4EQ2U3Vpc16JwHhBAtA", temperature: 0 });
  const output = (await model.invoke(input)).content.toString();

  try {
    return parser.parse(output);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new Gemini({ temperature: 0 }),
      parser
    );
    const fix = await fixParser.parse(output);
    return fix;
  }
};

export const qa = async (question: any, entries: any) => {
  const docs = entries.map(
    (entry: any) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      })
  );
  const model = new Gemini({ temperature: 0 });
  const chain = loadQARefineChain(model);
  const embeddings = new GeminiEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);
  const res = await chain.invoke({
    input_documents: relevantDocs,
    question,
  });

  return res.output_text;
};
