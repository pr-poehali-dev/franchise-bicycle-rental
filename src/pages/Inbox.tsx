import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FranchiseRequest {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Inbox = () => {
  const [requests, setRequests] = useState<FranchiseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/251a5d2c-be77-4b4e-9c32-c08b74dca6dd');
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Обновление каждые 30 секунд
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Загрузка заявок...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="https://cdn.poehali.dev/files/5680030b-a296-4855-a363-45910d40a22d.png" 
                alt="Доставело" 
                className="h-14 md:h-16"
              />
            </a>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Icon name="Mail" size={20} className="mr-2" />
                {requests.length} заявок
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-secondary">Входящие заявки</h1>
            <p className="text-muted-foreground">Все заявки на франшизу от потенциальных партнеров</p>
          </div>

          {requests.length === 0 ? (
            <Card className="text-center p-12">
              <Icon name="Inbox" size={64} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-xl text-muted-foreground">Пока нет заявок</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {request.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{request.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(request.created_at)}
                          </p>
                        </div>
                      </div>
                      {!request.is_read && (
                        <Badge className="bg-primary">Новая</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Phone" size={16} />
                      <a href={`tel:${request.phone}`} className="hover:text-primary">
                        {request.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon name="Mail" size={16} />
                      <a href={`mailto:${request.email}`} className="hover:text-primary">
                        {request.email}
                      </a>
                    </div>
                    {request.message && (
                      <div className="pt-3 border-t">
                        <p className="text-sm font-semibold mb-2 text-secondary">Сообщение:</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{request.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
