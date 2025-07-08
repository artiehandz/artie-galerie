document.addEventListener("DOMContentLoaded", async () => {
  const gallery = document.getElementById("gallery");
  const artistList = document.getElementById("artistList");
  const logoScreen = document.getElementById("logoScreen");

  const walletAddress = "0x4A39Ae58b605102913Ac19b7c071dA75b55B2674";
  const baseUrl = `https://api.reservoir.tools/users/${walletAddress}/tokens/v7?limit=50`;

  const renameMap = {
    "zora.eth": "Zora Core",
    "Unknown": "Unnamed",
    "wiwizn by qubibi": "qubibi"
    "wiwizn Part III by qubibi": "qubibi"
    ""Magical" Door by qubibi": "qubibi"
    // Add more mappings as needed
  };

  async function fetchAllTokens(url) {
    let allTokens = [];
    let continuation = null;

    do {
      const res = await fetch(continuation ? url + `&continuation=${continuation}` : url);
      const data = await res.json();
      allTokens = allTokens.concat(data.tokens || []);
      continuation = data.continuation || null;
    } while (continuation);

    return allTokens;
  }

  try {
    const tokens = await fetchAllTokens(baseUrl);
    const artistMap = {};

    tokens.forEach(t => {
      let rawName = (
        t.token?.metadata?.artist ||
        t.token?.metadata?.creator ||
        t.token?.collection?.name ||
        "Unknown"
      );
      let name = typeof rawName === "string" ? rawName : "Unknown";
      name = renameMap[name] || name;
      if (!artistMap[name]) artistMap[name] = [];
      artistMap[name].push(t.token);
    });

    const sortedArtists = Object.keys(artistMap).sort();

    sortedArtists.forEach(artist => {
      const item = document.createElement("div");
      item.textContent = artist;
      item.classList = "cursor-pointer mb-2 hover:underline";
      item.onclick = () => {
        logoScreen.classList.add("hidden");
        gallery.classList.remove("hidden");
        gallery.innerHTML = "";

        artistMap[artist].forEach(token => {
          const imageUrl = token.image || "";
          const title = token.name || `Token #${token.tokenId}`;
          const div = document.createElement("div");
          div.classList = "bg-white p-2 rounded shadow text-center";
          div.innerHTML = `
            <a href="${imageUrl}" target="_blank" rel="noopener noreferrer">
              <div class="h-96 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src="${imageUrl}" alt="${title}" class="max-h-96 object-contain" />
              </div>
            </a>
            <p class="mt-2 text-sm font-bold">"${artist}" — ${title}</p>
          `;
          gallery.appendChild(div);
        });
      };
      artistList.appendChild(item);
    });
  } catch (e) {
    console.error("Error fetching NFTs:", e);
    gallery.innerHTML = "<p>Failed to load NFTs. Try again later.</p>";
  }
});
