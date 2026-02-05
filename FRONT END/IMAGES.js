// Script to download placeholder images for development
const fs = require('fs');
const https = require('https');
const path = require('path');

const imageUrls = {
    'hero-bg.jpg': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop',
    'about-bg.jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    
    'rooms/standard1.jpg': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
    'rooms/standard2.jpg': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    'rooms/deluxe1.jpg': 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&h=600&fit=crop',
    'rooms/deluxe2.jpg': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'rooms/suite1.jpg': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    'rooms/family1.jpg': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
    
    'amenities/pool.jpg': 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop',
    'amenities/spa.jpg': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    'amenities/restaurant.jpg': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    
    'activities/hiking.jpg': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop',
    'activities/skiing.jpg': 'https://images.unsplash.com/photo-1534142499731-a32a99935397?w=800&h=600&fit=crop'
};

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function downloadAllImages() {
    console.log('Downloading images for Kizaluna Lodge...');
    
    for (const [filename, url] of Object.entries(imageUrls)) {
        const filepath = path.join(__dirname, 'images', filename);
        const dir = path.dirname(filepath);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        try {
            console.log(`Downloading ${filename}...`);
            await downloadImage(url, filepath);
            console.log(`✓ Downloaded ${filename}`);
        } catch (error) {
            console.error(`✗ Error downloading ${filename}:`, error.message);
        }
    }
    
    console.log('All images downloaded!');
}

downloadAllImages();