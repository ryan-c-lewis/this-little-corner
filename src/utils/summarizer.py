import json
import openai
import os
import torch
from transformers import pipeline
from deepmultilingualpunctuation import PunctuationModel

# openai.com api key
key = "..."


def punctuate(raw_text):
    return PunctuationModel().restore_punctuation(raw_text)


def call_gpt(text):
    model = "text-davinci-003"  # best model, but expensive
    # model = "text-curie-001"  # worse model, but more affordable
    openai.api_key = key
    response = openai.Completion.create(
        model=model,
        prompt=text + '\n\n',
        temperature=0.7,
        max_tokens=200,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=1
    )
    return response.choices[0].text.strip()


def ask_gpt_for_summary(text):
    return call_gpt('Summarize the following:\n' + text)


def ask_gpt_for_topics(text):
    return call_gpt('Summarize the following as a list of topics:\n' + text)


def ask_long_t5_for_summary(prompt):
    summarizer = pipeline(
        "summarization",
        "pszemraj/long-t5-tglobal-base-16384-book-summary",
        device=0 if torch.cuda.is_available() else -1,
    )
    result = summarizer(prompt)
    return result[0]["summary_text"]


def split_into_chunks(punctuated_text, sentences_per_chunk):
    sentences = punctuated_text.split('. ')  # todo what about sentences that end with question marks? and periods that aren't sentence endings?
    chunks = []
    for i in range(0, len(sentences), sentences_per_chunk):
        chunk = '. '.join(sentences[i:i+sentences_per_chunk])
        chunks.append(chunk)
    return chunks


def summarize_punctuated_text(punctuated_text):
    summaries = []
    for chunk in split_into_chunks(punctuated_text, 30):
        chunk_summary = ask_long_t5_for_summary(chunk)
        summaries.append(chunk_summary)
        print('summary ' + str(len(summaries)) + ': ' + chunk_summary)
    full_summary = ' '.join(summaries)
    return ask_gpt_for_topics(full_summary)


def summarize_text(raw_text):
    print('punctuating ' + raw_text)
    punctuated_text = punctuate(raw_text)
    print('punctuated: ' + punctuated_text)
    summarize_punctuated_text(punctuated_text)


def summarize_file(path):
    with open(path, 'r') as f:
        metadata = json.load(f)
        raw_transcript = ' '.join([x['text'] for x in metadata['transcript_parts']])
        return summarize_text(raw_transcript)


def summarize_directory(directory):
    for subdirectory, subdir_list, file_list in os.walk(directory):
        for file_name in file_list:
            full_path = os.path.join(subdirectory, file_name)
            summary = summarize_file(full_path)
            print(summary)


if __name__ == '__main__':
    summarize_file('../data/video_metadata/UCGsDIP_K6J6VSTqlq-9IPlg/uhn2ibaMTMI.json')  # griz
    # summarize_directory("../data/video_metadata/UCGsDIP_K6J6VSTqlq-9IPlg")  # all pvk files
