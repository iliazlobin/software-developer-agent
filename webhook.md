```markdown
## Example: Replay GitHub webhook delivery with `curl`

This example shows how to replay a GitHub webhook delivery (e.g., `issue_comment.created`) using `curl`. Replace `<WEBHOOK_URL>` with your actual webhook endpoint.

```bash
curl -X POST https://unreliant-nacreous-leigha.ngrok-free.dev \
  -H "Accept: */*" \
  --data-binary @payload.json
curl -X POST https://unreliant-nacreous-leigha.ngrok-free.dev \
  -H "Accept: */*" \
  -H "Content-Type: application/json" \
  -H "User-Agent: GitHub-Hookshot/2444035" \
  -H "X-GitHub-Delivery: 5e0a4e10-9c91-11f0-96dd-5461187db048" \
  -H "X-GitHub-Event: issue_comment" \
  -H "X-GitHub-Hook-ID: 571596179" \
  -H "X-GitHub-Hook-Installation-Target-ID: 2010770" \
  -H "X-GitHub-Hook-Installation-Target-Type: integration" \
  -H "X-Hub-Signature: sha1=e30edf49c61c448dc4506560cfa154beb673b481" \
  -H "X-Hub-Signature-256: sha256=0e4c0246a74fc53a24b844da71d75b92561d9137300e2df042f63edb2b054011" \
  --data-binary @payload.json
```

**Instructions:**
1. Save the JSON payload (see below) to a file named `payload.json`.
2. Replace `<WEBHOOK_URL>` with your webhook endpoint.
3. Run the above `curl` command.

<details>
<summary>Click to expand JSON payload</summary>

```json
{
  "action": "created",
  "issue": {
    "url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12",
    "repository_url": "https://api.github.com/repos/iliazlobin/backstage-app",
    "labels_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12/labels{/name}",
    "comments_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12/comments",
    "events_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12/events",
    "html_url": "https://github.com/iliazlobin/backstage-app/issues/12",
    "id": 3462225743,
    "node_id": "I_kwDOP2cHEc7OXV9P",
    "number": 12,
    "title": "Summarize repo",
    "user": {
      "login": "iliazlobin",
      "id": 3456942,
      "node_id": "MDQ6VXNlcjM0NTY5NDI=",
      "avatar_url": "https://avatars.githubusercontent.com/u/3456942?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/iliazlobin",
      "html_url": "https://github.com/iliazlobin",
      "followers_url": "https://api.github.com/users/iliazlobin/followers",
      "following_url": "https://api.github.com/users/iliazlobin/following{/other_user}",
      "gists_url": "https://api.github.com/users/iliazlobin/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/iliazlobin/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/iliazlobin/subscriptions",
      "organizations_url": "https://api.github.com/users/iliazlobin/orgs",
      "repos_url": "https://api.github.com/users/iliazlobin/repos",
      "events_url": "https://api.github.com/users/iliazlobin/events{/privacy}",
      "received_events_url": "https://api.github.com/users/iliazlobin/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "labels": [
      {
        "id": 9366487268,
        "node_id": "LA_kwDOP2cHEc8AAAACLklA5A",
        "url": "https://api.github.com/repos/iliazlobin/backstage-app/labels/open-swe",
        "name": "open-swe",
        "color": "ba9a62",
        "default": false,
        "description": ""
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "assignees": [],
    "milestone": null,
    "comments": 1,
    "created_at": "2025-09-28T16:59:12Z",
    "updated_at": "2025-09-28T17:34:20Z",
    "closed_at": null,
    "author_association": "OWNER",
    "active_lock_reason": null,
    "sub_issues_summary": {
      "total": 0,
      "completed": 0,
      "percent_completed": 0
    },
    "issue_dependencies_summary": {
      "blocked_by": 0,
      "total_blocked_by": 0,
      "blocking": 0,
      "total_blocking": 0
    },
    "body": "could you please summarize repo and create summary.md",
    "reactions": {
      "url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12/reactions",
      "total_count": 0,
      "+1": 0,
      "-1": 0,
      "laugh": 0,
      "hooray": 0,
      "confused": 0,
      "heart": 0,
      "rocket": 0,
      "eyes": 0
    },
    "timeline_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12/timeline",
    "performed_via_github_app": null,
    "state_reason": null
  },
  "comment": {
    "url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/comments/3343942107",
    "html_url": "https://github.com/iliazlobin/backstage-app/issues/12#issuecomment-3343942107",
    "issue_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/12",
    "id": 3343942107,
    "node_id": "IC_kwDOP2cHEc7HUIHb",
    "user": {
      "login": "iliazlobin",
      "id": 3456942,
      "node_id": "MDQ6VXNlcjM0NTY5NDI=",
      "avatar_url": "https://avatars.githubusercontent.com/u/3456942?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/iliazlobin",
      "html_url": "https://github.com/iliazlobin",
      "followers_url": "https://api.github.com/users/iliazlobin/followers",
      "following_url": "https://api.github.com/users/iliazlobin/following{/other_user}",
      "gists_url": "https://api.github.com/users/iliazlobin/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/iliazlobin/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/iliazlobin/subscriptions",
      "organizations_url": "https://api.github.com/users/iliazlobin/orgs",
      "repos_url": "https://api.github.com/users/iliazlobin/repos",
      "events_url": "https://api.github.com/users/iliazlobin/events{/privacy}",
      "received_events_url": "https://api.github.com/users/iliazlobin/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "created_at": "2025-09-28T17:34:20Z",
    "updated_at": "2025-09-28T17:34:20Z",
    "body": "hey",
    "author_association": "OWNER",
    "reactions": {
      "url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/comments/3343942107/reactions",
      "total_count": 0,
      "+1": 0,
      "-1": 0,
      "laugh": 0,
      "hooray": 0,
      "confused": 0,
      "heart": 0,
      "rocket": 0,
      "eyes": 0
    },
    "performed_via_github_app": null
  },
  "repository": {
    "id": 1063716625,
    "node_id": "R_kgDOP2cHEQ",
    "name": "backstage-app",
    "full_name": "iliazlobin/backstage-app",
    "private": true,
    "owner": {
      "login": "iliazlobin",
      "id": 3456942,
      "node_id": "MDQ6VXNlcjM0NTY5NDI=",
      "avatar_url": "https://avatars.githubusercontent.com/u/3456942?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/iliazlobin",
      "html_url": "https://github.com/iliazlobin",
      "followers_url": "https://api.github.com/users/iliazlobin/followers",
      "following_url": "https://api.github.com/users/iliazlobin/following{/other_user}",
      "gists_url": "https://api.github.com/users/iliazlobin/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/iliazlobin/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/iliazlobin/subscriptions",
      "organizations_url": "https://api.github.com/users/iliazlobin/orgs",
      "repos_url": "https://api.github.com/users/iliazlobin/repos",
      "events_url": "https://api.github.com/users/iliazlobin/events{/privacy}",
      "received_events_url": "https://api.github.com/users/iliazlobin/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false
    },
    "html_url": "https://github.com/iliazlobin/backstage-app",
    "description": null,
    "fork": false,
    "url": "https://api.github.com/repos/iliazlobin/backstage-app",
    "forks_url": "https://api.github.com/repos/iliazlobin/backstage-app/forks",
    "keys_url": "https://api.github.com/repos/iliazlobin/backstage-app/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/iliazlobin/backstage-app/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/iliazlobin/backstage-app/teams",
    "hooks_url": "https://api.github.com/repos/iliazlobin/backstage-app/hooks",
    "issue_events_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/events{/number}",
    "events_url": "https://api.github.com/repos/iliazlobin/backstage-app/events",
    "assignees_url": "https://api.github.com/repos/iliazlobin/backstage-app/assignees{/user}",
    "branches_url": "https://api.github.com/repos/iliazlobin/backstage-app/branches{/branch}",
    "tags_url": "https://api.github.com/repos/iliazlobin/backstage-app/tags",
    "blobs_url": "https://api.github.com/repos/iliazlobin/backstage-app/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/iliazlobin/backstage-app/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/iliazlobin/backstage-app/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/iliazlobin/backstage-app/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/iliazlobin/backstage-app/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/iliazlobin/backstage-app/languages",
    "stargazers_url": "https://api.github.com/repos/iliazlobin/backstage-app/stargazers",
    "contributors_url": "https://api.github.com/repos/iliazlobin/backstage-app/contributors",
    "subscribers_url": "https://api.github.com/repos/iliazlobin/backstage-app/subscribers",
    "subscription_url": "https://api.github.com/repos/iliazlobin/backstage-app/subscription",
    "commits_url": "https://api.github.com/repos/iliazlobin/backstage-app/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/iliazlobin/backstage-app/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/iliazlobin/backstage-app/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/iliazlobin/backstage-app/contents/{+path}",
    "compare_url": "https://api.github.com/repos/iliazlobin/backstage-app/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/iliazlobin/backstage-app/merges",
    "archive_url": "https://api.github.com/repos/iliazlobin/backstage-app/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/iliazlobin/backstage-app/downloads",
    "issues_url": "https://api.github.com/repos/iliazlobin/backstage-app/issues{/number}",
    "pulls_url": "https://api.github.com/repos/iliazlobin/backstage-app/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/iliazlobin/backstage-app/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/iliazlobin/backstage-app/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/iliazlobin/backstage-app/labels{/name}",
    "releases_url": "https://api.github.com/repos/iliazlobin/backstage-app/releases{/id}",
    "deployments_url": "https://api.github.com/repos/iliazlobin/backstage-app/deployments",
    "created_at": "2025-09-25T02:53:53Z",
    "updated_at": "2025-09-25T04:08:52Z",
    "pushed_at": "2025-09-28T02:46:33Z",
    "git_url": "git://github.com/iliazlobin/backstage-app.git",
    "ssh_url": "git@github.com:iliazlobin/backstage-app.git",
    "clone_url": "https://github.com/iliazlobin/backstage-app.git",
    "svn_url": "https://github.com/iliazlobin/backstage-app",
    "homepage": null,
    "size": 1747,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": "TypeScript",
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": false,
    "has_pages": false,
    "has_discussions": false,
    "forks_count": 0,
    "mirror_url": null,
    "archived": false,
    "disabled": false,
    "open_issues_count": 12,
    "license": null,
    "allow_forking": true,
    "is_template": false,
    "web_commit_signoff_required": false,
    "topics": [],
    "visibility": "private",
    "forks": 0,
    "open_issues": 12,
    "watchers": 0,
    "default_branch": "master"
  },
  "sender": {
    "login": "iliazlobin",
    "id": 3456942,
    "node_id": "MDQ6VXNlcjM0NTY5NDI=",
    "avatar_url": "https://avatars.githubusercontent.com/u/3456942?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/iliazlobin",
    "html_url": "https://github.com/iliazlobin",
    "followers_url": "https://api.github.com/users/iliazlobin/followers",
    "following_url": "https://api.github.com/users/iliazlobin/following{/other_user}",
    "gists_url": "https://api.github.com/users/iliazlobin/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/iliazlobin/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/iliazlobin/subscriptions",
    "organizations_url": "https://api.github.com/users/iliazlobin/orgs",
    "repos_url": "https://api.github.com/users/iliazlobin/repos",
    "events_url": "https://api.github.com/users/iliazlobin/events{/privacy}",
    "received_events_url": "https://api.github.com/users/iliazlobin/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false
  },
  "installation": {
    "id": 87396728,
    "node_id": "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uODczOTY3Mjg="
  }
}
```
</details>
```
