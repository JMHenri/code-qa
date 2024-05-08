1. Use github trees instead of a recursive function to download files https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree
2. Move "downloaded repo" path to .env

## sort files into code, documentation, and configuration files using an llm
- Vectorize documentation files and use RAG retrieval if total filesize of all documentation is over a cost = C.


## when a user query is given, determine what filetypes are needed.
Use function calling to return an array of filetypes which are required to use such as
- Code
- Documentation
- Configuration
Only pass filetypes of the given type to the next stage of processing.

## If a code file or configuration file is oversize (e.g, >50,000 tokens), pass to a pipeline which 
* condenses many parts of a file into one with only relevant information
* Or, a pipeline which is created to deal with file parts, instead of whole files
* Or, create a prompt which can deal with both whole file, and file parts.



## Move code to DB.
Graph dbs are a tempting for this because very advanced LLM pipelines will need to carefully craft queries for the data they are looking for,
With graphs and links, llms will naturally be able to craft queries that look for linked data.

A sql database is easier to organize and has more history. An advanced LLM with access to a SQL Schema should also be able to find the data it needs.

## Move to Langserve.

## Put prompts into a more common format such as Jinja
