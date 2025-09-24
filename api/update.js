// api/update.js  (Vercel Serverless)
const axios = require('axios');
const { Buffer } = require('buffer');

module.exports = async (req, res) => {
  // 1. Cuma terima POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const newContent = JSON.stringify(req.body, null, 2);
  const path        = 'data_vps.json';
  const token       = process.env.GITHUB_TOKEN; // ghp_xxx
  const repo        = process.env.GITHUB_REPO;  // USER/REPO
  const branch      = 'main';

  const apiURL = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    // 2. Dapatkan SHA file terakhir
    const { data: fileData } = await axios.get(`${apiURL}?ref=${branch}`, {
      headers: { Authorization: `token ${token}` }
    });

    // 3. Push commit baru (replace file)
    await axios.put(apiURL, {
      message: 'auto: update data_vps.json',
      content: Buffer.from(newContent).toString('base64'),
      sha: fileData.sha,
      branch
    }, {
      headers: { Authorization: `token ${token}` }
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Gagal update GitHub' });
  }
};
