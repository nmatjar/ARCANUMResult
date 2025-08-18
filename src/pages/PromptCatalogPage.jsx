import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PROMPT_DEFINITIONS } from '../data/prompt-definitions-server';
import { ArcanumHeader } from '../components/arcanum/ArcanumHeader';
import { ArcanumFooter } from '../components/arcanum/ArcanumFooter';
import { ResultModal } from '../components/arcanum/ResultModal';
import { clientDataService } from '../services/client-data-service';
import { aiEngine } from '../services/ai-engine';

const PromptItem = ({ promptId, onExecute }) => {
  const { t } = useTranslation();
  const title = t(`promptCatalog.prompts.${promptId}.title`);
  const benefit = t(`promptCatalog.prompts.${promptId}.benefit`);

  return (
    <div className="border-b border-gray-700 py-4">
      <h4 className="text-lg font-semibold text-indigo-300">{title}</h4>
      <p className="text-gray-400 mt-1">{benefit}</p>
      <button
        onClick={() => onExecute(promptId, title)}
        className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
      >
        Wykonaj Analizę
      </button>
    </div>
  );
};

PromptItem.propTypes = {
  promptId: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};

const PromptCategory = ({ categoryId, promptIds, onExecutePrompt }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(categoryId === '1'); // Domyślnie otwarta pierwsza kategoria

  return (
    <div id={`category-${categoryId}`} className="mb-4 bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 font-bold text-xl text-white bg-gray-900 hover:bg-gray-700 rounded-t-lg focus:outline-none transition duration-300 flex justify-between items-center"
      >
        {t(`promptCatalog.categories.${categoryId}`)}
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="p-4">
          {promptIds.map(id => (
            <PromptItem key={id} promptId={id} onExecute={onExecutePrompt} />
          ))}
        </div>
      )}
    </div>
  );
};

PromptCategory.propTypes = {
  categoryId: PropTypes.string.isRequired,
  promptIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onExecutePrompt: PropTypes.func.isRequired,
};

const PromptCatalogPage = ({ clientData }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleExecutePrompt = async (promptId, title) => {
    setIsModalOpen(true);
    setIsLoading(true);
    setResult(null);
    setModalTitle(title);

    try {
      const metaAnalysis = await clientDataService.getMetaAnalysis(clientData.code);
      if (!metaAnalysis) {
        throw new Error("Nie udało się pobrać MetaAnalysis.");
      }

      const isVisualPrompt = promptId.startsWith('7.');
      const responseFormat = isVisualPrompt ? 'json' : 'html';
      const rawPrompt = PROMPT_DEFINITIONS[promptId];
      
      const finalPrompt = `${rawPrompt}\n\nFormat odpowiedzi: ${responseFormat}`;

      const aiResult = await aiEngine.generateGenericPrompt(finalPrompt, metaAnalysis, responseFormat);

      setResult({ type: responseFormat, data: aiResult });
    } catch (error) {
      console.error("Błąd podczas wykonywania promptu:", error);
      setResult({ type: 'html', data: `<p class="text-red-400">Wystąpił błąd: ${error.message}</p>` });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResult(null);
  };

  const promptCategories = Object.keys(PROMPT_DEFINITIONS).reduce((acc, key) => {
    const categoryId = key.split('_')[0];
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(key);
    return acc;
  }, {});

  return (
    <div className="bg-gray-900 min-h-screen">
      <ArcanumHeader clientData={clientData} />
      <div className="container mx-auto px-4 py-8 text-white">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-400">{t('promptCatalog.title')}</h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            {t('promptCatalog.description')}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4 text-indigo-300">Kategorie</h3>
              <ul className="space-y-2">
                {Object.keys(promptCategories).map(catId => (
                  <li key={catId}>
                    <a href={`#category-${catId}`} className="hover:text-indigo-400 transition duration-300">
                      {t(`promptCatalog.categories.${catId}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="md:w-3/4">
            <div className="mb-8">
              {Object.entries(promptCategories).map(([catId, promptIds]) => (
                <PromptCategory
                  key={catId}
                  categoryId={catId}
                  promptIds={promptIds}
                  onExecutePrompt={handleExecutePrompt}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <ArcanumFooter clientData={clientData} />
      <ResultModal
        isOpen={isModalOpen}
        onClose={closeModal}
        isLoading={isLoading}
        result={result}
        title={modalTitle}
      />
    </div>
  );
};

PromptCatalogPage.propTypes = {
  clientData: PropTypes.object.isRequired,
};

export default PromptCatalogPage;
