
  const photoGrid = document.getElementById('photoGrid');
  const searchInput = document.getElementById('search');
  const searchBtn = document.getElementById('searchBtn');
  const loading = document.getElementById('loading');

  async function fetchMemes(query = '') {
      try {
          loading.style.display = 'block';
          const response = await fetch('https://api.imgflip.com/get_memes');
          const data = await response.json();
          let memes = data.data.memes;
          if (query) {
              memes = memes.filter(meme => meme.name.toLowerCase().includes(query.toLowerCase()));
          }
          return memes.map(meme => ({
              url: meme.url,
              title: meme.name
          }));
      } catch (error) {
          console.error('Erro ao carregar memes:', error);
          return [];
      } finally {
          loading.style.display = 'none';
      }
  }

  function displayMemes(memes) {
      if (memes.length === 0) {
          photoGrid.innerHTML = '<p class="no-results">Nenhum meme encontrado</p>';
          return;
      }
      photoGrid.innerHTML = memes.map(meme => `
          <div class="photo-card">
              <img 
                  src="${meme.url}" 
                  alt="${meme.title}" 
                  loading="lazy"
              >
              <div class="photo-info">
                  <h3>${meme.title}</h3>
              </div>
          </div>
      `).join('');
  }

  function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout);
              func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
      };
  }

  searchInput.addEventListener('input', debounce((e) => {
      fetchMemes(e.target.value).then(displayMemes);
  }, 300));

  searchBtn.addEventListener('click', () => {
      fetchMemes(searchInput.value).then(displayMemes);
  });

  fetchMemes().then(displayMemes);
