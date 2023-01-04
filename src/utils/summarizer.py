import json
import openai
import os
from deepmultilingualpunctuation import PunctuationModel

# openai.com api key
key = "your api key here"

# best model, but expensive
model = "text-davinci-003"
sentences_per_chunk = 200

# worse model, but more affordable
# model = "text-curie-001"
# sentences_per_chunk = 40


def punctuate(raw_text):
    return PunctuationModel().restore_punctuation(raw_text)


def ask_gpt_for_summary(prompt):
    openai.api_key = key
    response = openai.Completion.create(
        model=model,
        prompt=prompt + '\n\n',
        temperature=0.7,
        max_tokens=200,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=1
    )
    return response.choices[0].text.strip()


def summarize(raw_text):
    punctuated_text = punctuate(raw_text)
    sentences = punctuated_text.split('. ')
    summaries = []
    for i in range(0, len(sentences), sentences_per_chunk):
        chunk = 'Summarize the following:\n' + '. '.join(sentences[i:i+sentences_per_chunk])
        chunk_summary = ask_gpt_for_summary(chunk)
        print(chunk_summary)
        summaries.append(chunk_summary)
    return ask_gpt_for_summary('Summarize the following as a list of topics:\n' + ' '.join(summaries))


if __name__ == '__main__':
    pvk_directory = "../data/video_metadata/UCGsDIP_K6J6VSTqlq-9IPlg"
    for dirName, subdirList, fileList in os.walk(pvk_directory):
        for fname in fileList:
            print(fname)
            with open(os.path.join(dirName, fname), 'r') as f:
                metadata = json.load(f)
                raw_transcript = ' '.join([x['text'] for x in metadata['transcript_parts']])
                summary = summarize(raw_transcript)
                print(summary)
