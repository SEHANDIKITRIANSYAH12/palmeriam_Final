import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Newspaper, FileText } from 'lucide-react';
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { newsData, NewsArticle } from '@/data/news';

// Di masa depan, kita bisa menambahkan sumber data lain di sini
// import { layananData, Layanan } from '@/data/layanan';

interface SearchResult {
  type: 'Berita' | 'Layanan';
  title: string;
  url: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const performSearch = useCallback((q: string) => {
    if (!q) {
      setResults([]);
      return;
    }

    const lowerQuery = q.toLowerCase();
    const newsResults: SearchResult[] = newsData
      .filter(article => 
        article.title.toLowerCase().includes(lowerQuery) || 
        article.summary.toLowerCase().includes(lowerQuery)
      )
      .map(article => ({
        type: 'Berita',
        title: article.title,
        url: `/berita/${article.slug}`,
      }));

    // Gabungkan hasil dari semua sumber data
    setResults([...newsResults]);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(query);
    }, 200); // debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [query, performSearch]);

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Search className="w-4 h-4" />
        Cari... <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">⌘K</kbd>
      </button>
      <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
        <Search className="w-5 h-5 text-foreground" aria-label="Buka pencarian"/>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Ketik untuk mencari berita, layanan, atau informasi..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>{query.length > 2 ? 'Tidak ada hasil yang ditemukan.' : 'Ketik sesuatu untuk mencari.'}</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Hasil Pencarian">
              {results.map((result) => (
                <CommandItem
                  key={result.url}
                  value={result.title}
                  onSelect={() => handleSelect(result.url)}
                  className="cursor-pointer"
                >
                  {result.type === 'Berita' ? <Newspaper className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                  <span>{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
