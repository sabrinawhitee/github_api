const express = require("express");
const app = express();
const { Octokit } = require("@octokit/core");
const octokit = new Octokit();


app.get('/search', async (req, res) => {
    try {
        const { url } = req.query;
        const url_arr = url.split('/');
        const repo = url_arr[url_arr.length - 1];
        const user = url_arr[url_arr.length - 2];

        // Get all of the open pull requests
        const request = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: user,
            repo: repo,
            state: "open"
        })

        const prs = request.data.map(pr => pr.number);
        const return_json = {
            "pull_requests": [
            ]
        }
        // For each pull request, get the number of commits
        for (let pr of prs) {
            const request = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
                owner: user,
                repo: repo,
                pull_number: pr
            })
            // Add the pull request number and commit length to the return json
            const pull_request = { "pr_number": pr, "num_of_commits": request.data.length }
            return_json.pull_requests.push(pull_request);
        }

        res.json(return_json);
    }
    // in the event of an error, return an error page
    catch(e){
        res.send(`<h1>Error trying to access ${req.query.url}. Returned with error: ${e}</h1>`)
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
