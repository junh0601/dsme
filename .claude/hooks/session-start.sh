#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install Python dependencies
# requirements.txt has UTF-16 encoding issues and bs4==0.0.1 fails to build
# on newer Python. Install core packages directly instead.
pip install beautifulsoup4==4.11.1 requests==2.28.1
