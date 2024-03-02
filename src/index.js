import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = "42573503-814be0cbf75c4ae20afa280cd";
let currentPage = 1; 
const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none';

// Funkcja do wysyłania zapytania do API Pixabay i tworzenia galerii
async function fetchImagesAndGallery(searchQuery, apiKey, page) {
  const gallery = document.querySelector('.gallery');
  
  if (page === 1) {
    gallery.innerHTML = ''; // Czyszczenie galerii tylko przy pierwszej stronie wyników
  }

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;
  
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.hits.length <= 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return [];
    } else {
      const imagesHTML = data.hits.map(image => `
        <div class="photo-card">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `).join('');

      gallery.insertAdjacentHTML('beforeend', imagesHTML);

      // Wyświetlenie przycisku "Load more" tylko wtedy, gdy jest dostępne więcej wyników
      if (data.totalHits > currentPage * 40) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};


// Wywołanie funkcji przy przesłaniu formularza wyszukiwania
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const searchQuery = this.elements.searchQuery.value;
  currentPage = 1; // Resetowanie strony do 1 po wysłaniu nowego zapytania
  fetchImagesAndGallery(searchQuery, apiKey);
});

// Wywołanie funkcji przy kliknięciu przycisku "Load more"
loadMoreButton.addEventListener('click', function() {
  const searchQuery = document.querySelector('.search-form').elements.searchQuery.value;
  currentPage++;
  fetchImagesAndGallery(searchQuery, apiKey, currentPage);
});