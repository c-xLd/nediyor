import { 
  Brand, 
  Category, 
  Product, 
  ProductScore, 
  Topic, 
  ProductTopicScore, 
  Source, 
  Mention, 
  AISummary 
} from '../../src/types/index.js';
import { brandsList, categoriesList, sourcesList, topicsList } from './mockProductsData.js';
import { productsCatalog } from './mockCatalog.js';
import { productScoresCatalog } from './mockScoresAndAI.js';
import { 
  productTopicScoresCatalog, 
  aiSummariesCatalog, 
  mentionsCatalog, 
  productAlternativesCatalog 
} from './mockTopicsAndAI.js';

export function initialSeedData() {
  const brands: Brand[] = [...brandsList];
  const categories: Category[] = [...categoriesList];
  const sources: Source[] = [...sourcesList];
  const topics: Topic[] = [...topicsList];
  const products: Product[] = [...productsCatalog];
  const productScores: ProductScore[] = [...productScoresCatalog];
  const productTopicScores: ProductTopicScore[] = [...productTopicScoresCatalog];
  const aiSummaries: AISummary[] = [...aiSummariesCatalog];
  const mentions: Mention[] = [...mentionsCatalog];
  const productAlternatives = [...productAlternativesCatalog];

  return {
    brands,
    categories,
    products,
    productScores,
    topics,
    productTopicScores,
    sources,
    mentions,
    aiSummaries,
    productAlternatives
  };
}
