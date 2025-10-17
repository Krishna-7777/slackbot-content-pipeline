# Slackbot Content Pipeline

## Overview

**Slackbot Content Pipeline** is a Slack-integrated tool designed to streamline the **content creation workflow** for marketing or content teams. It takes raw keyword lists, processes them intelligently, and delivers structured outputs including **keyword clusters, top-ranking content analysis, post ideas**, and **PDF reports**, all accessible directly in Slack.

The bot leverages **AI-based suggestions**, web scraping, and clustering algorithms to automate content research, significantly reducing manual effort and improving content relevance and SEO performance.

---

## How to use/access/test this bot

1. Join my slack workspace: [slack](https://join.slack.com/t/krishnasworks-tcs8479/shared_invite/zt-3fc35ktdj-FJW~JN9~ivptyPuYmrHTLA)
2. Join channel named `#test-slack-bot`
3. You can run the following commands in it:
   - `/process-keywords`
   - `/process-uploaded-file`
   - `/history`
   - `/regenerate`
  
`NOTE:` It is deployed on Render.com Free tier, which spins down the intance on inactivity. You may get operation_timeout error, instance spins up in around 2 mins then you can test.

---

## Key Features

1. **Keyword Upload and Parsing**
   - Users provide a raw list of keywords via Slack command `/process-keywords`.
   - The bot parses CSV-like text input, cleans duplicates, and normalizes keywords.

2. **Keyword Embedding and Clustering**
   - Converts keywords into vector embeddings for semantic similarity.
   - Clusters keywords using **k-means clustering** to group related keywords.
   - Clustered keywords are shared back in Slack for easy verification.

3. **Top Content Analysis**
   - For each keyword cluster, the bot scrapes the **top 5 search results** from Brave Search.
   - Extracted information includes:
     - Page title
     - Meta description
     - Headings (H1–H3)
   - Provides insight into competitors’ content structure and topic coverage.

4. **AI-Based Post Idea Generation**
   - The bot leverages an AI model (`meta-llama/llama-3.2-3b-instruct`) to suggest **unique and engaging blog post ideas** based on the analyzed top pages.
   - Each idea is mapped to its relevant keyword cluster.
   - The AI ensures suggestions are human-like, SEO-friendly, and avoid boilerplate phrasing.

5. **PDF Report Generation**
   - Generates a **downloadable PDF report** summarizing:
     - Keyword clusters
     - Top-ranking pages and extracted content
     - Suggested post ideas
   - The PDF is automatically uploaded to the Slack thread, making collaboration seamless.

6. **Pipeline Logging and History**
   - Every Slack command execution is logged with metadata:
     - Command name, status (enum), keywords uploaded, keyword count, error reasons (if any)
   - Users can query `/history` to view the **last 5 pipeline runs**.
   - `/regenerate` allows rerunning a previous pipeline by its ID.

---

## Architecture

The Slackbot Content Pipeline is built with **Node.js** using the **Slack Bolt framework**. Key architectural components include:

1. **Slack Integration**
   - Commands: `/process-keywords`, `/process-uploaded-file`, `/history`, `/regenerate`
   - Responds with real-time Slack messages and thread-based PDF uploads

2. **Data Processing**
   - **Keyword cleaning and embedding**: Removes duplicates, normalizes text, and creates vector embeddings for clustering
   - **Clustering**: Uses **k-means algorithm** to group semantically similar keywords

3. **Web Scraping**
   - Powered by **Puppeteer** (bundled Chromium) and **Cheerio**
   - Sequential page visits per cluster to reduce memory usage
   - Optimized for **low-memory environments** (<512MB) using:
     - `--single-process` and `--disable-dev-shm-usage` Chromium flags
     - Immediate `page.close()` after scraping each URL
     - Delays between requests to prevent rate-limiting

4. **AI Integration**
   - Requests sent to **OpenRouter API** using `meta-llama/llama-3.2-3b-instruct`
   - Generates **human-like post ideas** from extracted content without hard-coded templates

5. **Persistence**
   - Lightweight **SQLite database** stores pipeline history
   - Logs include command name, status enum, error reasons, keywords, and counts
   - No persistent storage required for temporary app state; ideal for containerized environments

6. **Containerization**
   - Entire backend bundled into a **Docker container**
   - Optimized for **low-memory platforms** (e.g., 512MB Render containers)
   - Dockerfile installs only necessary system dependencies for Puppeteer and Node.js

---

## Pipeline Workflow

1. **User triggers `/process-keywords`,`/process-keywords`, `/regenerate`** in Slack
2. **Bot parses and cleans keywords**
3. **Embeddings are generated** and keywords are clustered
4. **Top-ranking pages are analyzed** for each cluster
5. **AI generates post ideas** for clusters
6. **PDF report is generated and uploaded** to the Slack thread
7. **Pipeline run is logged** in SQLite for history and future regeneration

---
