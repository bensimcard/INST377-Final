document.addEventListener('DOMContentLoaded', () => {
  const breedDropdown = document.getElementById('breedDropdown');
  const viewBtn = document.getElementById('viewBtn');
  const saveBtn = document.getElementById('saveBtn');
  const dogDisplay = document.getElementById('dogDisplay');
  
  let currentImageUrl = '';

  // Hits backend to pull random image for selected breed
  async function loadDogImage(breed) {
    if (!breed) return;
    try {
      const response = await fetch(`/api/dog-image/${breed}`);
      const data = await response.json();
      if (data.imageUrl) {
        currentImageUrl = data.imageUrl;
        dogDisplay.src = data.imageUrl;
      }
    } catch (err) {
      console.log('Error pulling down image frame:', err);
    }
  }

  // Sends active image layout data up to supabase through API
  async function saveToFavorites() {
    const breedName = breedDropdown.value;
    if (!breedName || !currentImageUrl) {
      alert('Please select a breed and image first.');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ breed_name: breedName, image_url: currentImageUrl })
      });

      if (response.ok) {
        confetti(); // confetti effect
        alert(`${breedName} has been added to your favorites list.`);
        loadFavoritesGallery(); // carousel view
      }
    } catch (err) {
      console.log('Error saving favorite entry:', err);
    }
  }

  // Reloads and renders the updated favorites timeline carousel
  async function loadFavoritesGallery() {
    try {
      const response = await fetch('/api/favorites');
      const favorites = await response.json();
      
      console.log('Loaded favorites list payload:', favorites); // Dev testing check
      
      const carouselList = document.getElementById('carouselList');
      carouselList.innerHTML = ''; // Wipe old nodes

      favorites.forEach(item => {
        const li = document.createElement('li');
        li.className = 'splide__slide';
        li.innerHTML = `
          <img src="${item.image_url}" alt="${item.breed_name}" style="width:150px; height:150px; object-fit:cover; border-radius:8px;">
          <p style="text-align:center; text-transform:capitalize;">${item.breed_name}</p>
        `;
        carouselList.appendChild(li);
      });

      // Only mount/initialize splide slider instance if data rows exist
      if (favorites.length > 0) {
        new Splide('#favoritesCarousel', {
          perPage: 3,
          gap: '10px',
          rewind: true,
        }).mount();
      }
    } catch (err) {
      console.log('Error building splide layout nodes:', err);
    }
  }

  // Pulls full list from the api to initialize dropdown options
  async function populateDropdown() {
    try {
      const response = await fetch('/api/breeds-list');
      const breeds = await response.json();
      
      breedDropdown.innerHTML = '<option value="">Select a Breed</option>';

      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedDropdown.appendChild(option);
      });
    } catch (err) {
      console.log('Dropdown mapping sequence broke:', err);
    }
  }

  // event Listeners setup
  breedDropdown.addEventListener('change', (e) => loadDogImage(e.target.value));
  viewBtn.addEventListener('click', () => loadDogImage(breedDropdown.value));
  saveBtn.addEventListener('click', saveToFavorites);

  // Core app init calls
  populateDropdown();
  loadFavoritesGallery();
});