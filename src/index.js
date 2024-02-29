import Notiflix from 'notiflix';
import axios from 'axios';

const apiKey = "42573503-814be0cbf75c4ae20afa280cd";

// Funkcja do wysyłania zapytania do API Pixabay
async function fetchImagesAndGallery(searchQuery, apiKey) {
  const gallery = document.querySelector('.gallery');
  
  gallery.innerHTML = '';

  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;
  
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

      gallery.innerHTML = imagesHTML;
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure("An error occurred while fetching images. Please try again later.");
    return [];
  }
};

const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const searchQuery = this.elements.searchQuery.value;
  fetchImagesAndGallery(searchQuery, apiKey);
});