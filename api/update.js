// api/update.js  (Vercel serverless)
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const data = req.body;
  const filePath = path.join(process.cwd(), 'data_vps.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  const token = process.env.GITHUB_TOKEN;        // personal access token
  const repo = process.env.GITHUB_REPO;          // USERNAME/REPO
  const branch = 'main';

  // Git add, commit, push via simple-git
  const simpleGit = require('simple-git');
  const git = simpleGit();
  await git.add('data_vps.json');
  await git.commit('auto: update data_vps.json');
  await git.push('origin', branch);
  res.json({ ok: true });
};
