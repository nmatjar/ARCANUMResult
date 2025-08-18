import React from 'react';
import '../assets/styles/ShareButtons.css';

export const ShareButtons = ({ resultData, featureTitle }) => {
  const handleShare = (platform) => {
    if (!resultData) return;
    
    const shareText = `Sprawdź moje wyniki testu inteligentnej kariery: ${featureTitle}`;
    const shareUrl = window.location.href;
    
    let shareWindow;
    
    switch (platform) {
      case 'facebook':
        shareWindow = window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          'facebook-share',
          'width=650,height=500'
        );
        break;
        
      case 'twitter':
        shareWindow = window.open(
          `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          'twitter-share',
          'width=650,height=500'
        );
        break;
        
      case 'linkedin':
        shareWindow = window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          'linkedin-share',
          'width=650,height=500'
        );
        break;
        
      default:
        alert('Funkcja udostępniania zostanie zaimplementowana w pełnej wersji aplikacji.');
    }
    
    if (shareWindow) shareWindow.focus();
  };

  const handleSave = () => {
    if (!resultData || !resultData.content) return;
    
    try {
      // Utwórz element tymczasowy do przechowania treści
      const element = document.createElement('a');
      
      // Czysta treść bez tagów HTML
      const cleanContent = resultData.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const content = `# ${featureTitle}\n\n${cleanContent}`;
      
      // Utwórz plik do pobrania
      const file = new Blob([content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${featureTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
      
      // Symuluj kliknięcie, aby pobrać
      document.body.appendChild(element);
      element.click();
      
      // Usuń element tymczasowy
      document.body.removeChild(element);
    } catch (error) {
      console.error('Błąd podczas zapisywania:', error);
      alert('Wystąpił błąd podczas zapisywania. Spróbuj ponownie.');
    }
  };

  const handlePrint = () => {
    if (!resultData || !resultData.content) return;
    
    try {
      // Utwórz nowe okno
      const printWindow = window.open('', '_blank');
      
      // Dodaj treść i style
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${featureTitle} - Inteligentna Kariera</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1 {
                color: #4a6bff;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
              }
              img {
                max-width: 100%;
                height: auto;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <h1>${featureTitle}</h1>
            ${resultData.content || ''}
            ${Array.isArray(resultData.imageUrl) && resultData.imageUrl.length > 0 
              ? `<div class="image-grid">${resultData.imageUrl.map(url => 
                  `<img src="${url}" alt="Wizualizacja" style="max-width: 100%; margin: 10px 0;" />`).join('')}</div>` 
              : resultData.imageUrl 
                ? `<img src="${resultData.imageUrl}" alt="Wizualizacja" />` 
                : ''}
            <div class="footer">
              Wygenerowano przez Inteligentna Kariera &copy; ${new Date().getFullYear()}
            </div>
          </body>
        </html>
      `);
      
      // Wywołaj drukowanie
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 300);
    } catch (error) {
      console.error('Błąd podczas drukowania:', error);
      alert('Wystąpił błąd podczas drukowania. Spróbuj ponownie.');
    }
  };

  return (
    <div className="share-buttons">
      <button className="share-btn save" onClick={handleSave}>
        <i className="fa-solid fa-download"></i> 
        <span>Zapisz wynik</span>
      </button>
      
      <button className="share-btn print" onClick={handlePrint}>
        <i className="fa-solid fa-print"></i>
        <span>Drukuj</span>
      </button>
      
      <button className="share-btn facebook" onClick={() => handleShare('facebook')}>
        <i className="fa-brands fa-facebook-f"></i>
        <span>Udostępnij</span>
      </button>
      
      <button className="share-btn twitter" onClick={() => handleShare('twitter')}>
        <i className="fa-brands fa-x-twitter"></i>
        <span>Tweet</span>
      </button>
      
      <button className="share-btn linkedin" onClick={() => handleShare('linkedin')}>
        <i className="fa-brands fa-linkedin-in"></i>
        <span>LinkedIn</span>
      </button>
    </div>
  );
};