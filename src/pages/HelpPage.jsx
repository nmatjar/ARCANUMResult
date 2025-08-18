import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import '../assets/styles/HelpPage.css';

const HelpPage = () => {
  return (
    <div className="app">
      <Header />
      
      <main className="container help-container">
        <div className="help-header">
          <h1>Pomoc - Inteligentna Kariera</h1>
          <p>Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące platformy</p>
        </div>
        
        <div className="help-sections">
          <div className="help-section">
            <h2>Wprowadzenie</h2>
            <p>
              Inteligentna Kariera to platforma wykorzystująca sztuczną inteligencję do 
              przeprowadzania zaawansowanej analizy predyspozycji zawodowych i wspierania 
              rozwoju kariery. Nasze narzędzia pomagają odkryć mocne strony, zidentyfikować 
              najlepsze ścieżki rozwoju i zrozumieć własne preferencje zawodowe.
            </p>
          </div>
          
          <div className="help-section">
            <h2>Rozpoczęcie pracy</h2>
            <div className="help-item">
              <h3>Jak zalogować się do platformy?</h3>
              <p>
                Wprowadź swój kod dostępu na stronie głównej. Kod otrzymasz od swojego doradcy zawodowego 
                lub po zakupie dostępu do platformy. Kod jest jednorazowy i przypisany do Twojego profilu.
              </p>
            </div>
            
            <div className="help-item">
              <h3>Co to są tokeny energii?</h3>
              <p>
                Tokeny energii to wirtualna waluta platformy, którą możesz wykorzystać do korzystania 
                z różnych funkcji. Każda operacja wymaga pewnej liczby tokenów. Po wykorzystaniu wszystkich 
                tokenów, skontaktuj się z doradcą w celu doładowania konta.
              </p>
            </div>
          </div>
          
          <div className="help-section">
            <h2>Funkcje platformy</h2>
            <div className="help-item">
              <h3>Asystent kariery AI</h3>
              <p>
                Asystent kariery AI to zaawansowane narzędzie wykorzystujące sztuczną inteligencję, 
                które analizuje Twój profil i pomaga odpowiedzieć na różne pytania dotyczące Twojej 
                kariery zawodowej. Możesz zadawać pytania dotyczące swoich predyspozycji zawodowych, 
                możliwych ścieżek rozwoju i otrzymywać spersonalizowane odpowiedzi.
              </p>
              <p>
                Aby skorzystać z asystenta, naciśnij przycisk "Asystent AI" w górnym menu lub wybierz 
                tę funkcję z głównego panelu. Możesz również zamknąć asystenta naciskając przycisk X, 
                klawisz ESC lub klikając poza obszarem asystenta.
              </p>
            </div>
            
            <div className="help-item">
              <h3>Przyszłe ścieżki kariery</h3>
              <p>
                Ta funkcja generuje potencjalne ścieżki rozwoju zawodowego dopasowane do Twojego profilu. 
                Otrzymasz szczegółowe informacje na temat możliwych kierunków rozwoju, wymaganych umiejętności 
                i kroków, które możesz podjąć, aby osiągnąć swoje cele zawodowe.
              </p>
            </div>
            
            <div className="help-item">
              <h3>Analiza dalszych studiów</h3>
              <p>
                Funkcja ta analizuje potencjalne kierunki studiów, które mogą być dla Ciebie najbardziej 
                korzystne, biorąc pod uwagę Twoje predyspozycje zawodowe i cele. Otrzymasz rekomendacje 
                dotyczące formalnej edukacji, kursów i certyfikatów.
              </p>
            </div>
          </div>
          
          <div className="help-section">
            <h2>Rozwiązywanie problemów</h2>
            <div className="help-item">
              <h3>Kod dostępu nie działa</h3>
              <p>
                Upewnij się, że wprowadzasz kod dokładnie tak, jak został przekazany, włącznie z 
                wielkimi literami i znakami specjalnymi. Jeśli kod nadal nie działa, może to oznaczać, 
                że został już wykorzystany lub wygasł. Skontaktuj się ze swoim doradcą zawodowym.
              </p>
            </div>
            
            <div className="help-item">
              <h3>Asystent AI nie odpowiada poprawnie</h3>
              <p>
                Jeśli asystent AI daje nieodpowiednie lub niekompletne odpowiedzi, upewnij się, że Twój 
                profil zawiera wszystkie niezbędne informacje. Możesz również spróbować przeformułować 
                swoje pytanie lub rozłożyć je na mniejsze, bardziej konkretne pytania.
              </p>
            </div>
          </div>
          
          <div className="help-section">
            <h2>Kontakt z nami</h2>
            <p>
              Masz pytania, które nie zostały tu uwzględnione? Skontaktuj się z nami za pomocą formularza 
              kontaktowego dostępnego w sekcji "Kontakt" lub napisz bezpośrednio na adres 
              <a href="mailto:pomoc@inteligentnakariera.pl"> pomoc@inteligentnakariera.pl</a>.
            </p>
            <p>
              <Link to="/" className="back-to-home">Powrót do strony głównej</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpPage;