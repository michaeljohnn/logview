const str = `2025-03-11 14:30:45 [INFO] [32m[Start] Initializing build environment...[0m
2025-03-11 14:31:02 [STEP] [34m→ Checking out repository git@github.com:example/project.git (branch: main)[0m
2025-03-11 14:31:15 [WARN] [33mDetected outdated dependency: lodash@4.17.15 (recommend upgrading to 4.17.21)[0m
2025-03-11 14:32:10 [ERROR] [31m× Compilation failed: Syntax error at src/index.js line 45[0m
2025-03-11 14:32:10 [ERROR] [31m   45 | const data = await fetchData();[0m
2025-03-11 14:32:10 [ERROR] [31m       ^^^^^ Undefined async function[0m
2025-03-11 14:33:25 [INFO] [32m✓ Successfully built test suite (duration: 2m40s)[0m
`;

export default str.split('\n');