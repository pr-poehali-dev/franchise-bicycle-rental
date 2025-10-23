import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [isUpdatingReviews, setIsUpdatingReviews] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save to database
      const saveResponse = await fetch('https://functions.poehali.dev/da58009b-07ea-4a0f-ac0b-5ed8af9d7a13', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const saveData = await saveResponse.json();
      
      if (saveData.success) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время",
        });
        
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Попробуйте еще раз",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateReviews = async () => {
    setIsUpdatingReviews(true);
    try {
      await fetch('https://functions.poehali.dev/77b19ba3-7530-41ba-8adc-4dec0ef96ac0', {
        method: 'POST'
      });
      
      const response = await fetch('https://functions.poehali.dev/77b19ba3-7530-41ba-8adc-4dec0ef96ac0');
      const data = await response.json();
      setReviews(data.slice(0, 6));
      localStorage.setItem('reviews_last_update', Date.now().toString());
      
      toast({
        title: "Отзывы обновлены!",
        description: `Загружено ${data.length} отзывов с Авито`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить отзывы",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingReviews(false);
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/77b19ba3-7530-41ba-8adc-4dec0ef96ac0');
        const data = await response.json();
        
        const lastUpdate = localStorage.getItem('reviews_last_update');
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        if (data.length === 0 || !lastUpdate || (now - parseInt(lastUpdate)) > oneDayMs) {
          await fetch('https://functions.poehali.dev/77b19ba3-7530-41ba-8adc-4dec0ef96ac0', {
            method: 'POST'
          });
          
          const retryResponse = await fetch('https://functions.poehali.dev/77b19ba3-7530-41ba-8adc-4dec0ef96ac0');
          const retryData = await retryResponse.json();
          setReviews(retryData.slice(0, 6));
          localStorage.setItem('reviews_last_update', now.toString());
        } else {
          setReviews(data.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };
    
    loadReviews();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <img 
              src="https://cdn.poehali.dev/files/5680030b-a296-4855-a363-45910d40a22d.png" 
              alt="Доставело" 
              className="h-10 md:h-16"
            />
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-base font-semibold hover:text-primary transition-colors">О франшизе</button>
              <button onClick={() => scrollToSection('package')} className="text-base font-semibold hover:text-primary transition-colors">Условия</button>
              <button onClick={() => scrollToSection('benefits')} className="text-base font-semibold hover:text-primary transition-colors">Преимущества</button>
              <button onClick={() => scrollToSection('success')} className="text-base font-semibold hover:text-primary transition-colors">Истории успеха</button>
              <Button onClick={() => scrollToSection('contact')} className="bg-primary hover:bg-primary/90">Оставить заявку</Button>
            </div>
            <Button onClick={() => scrollToSection('contact')} className="md:hidden bg-primary hover:bg-primary/90" size="sm">Заявка</Button>
          </div>
        </div>
      </nav>

      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 text-secondary leading-tight">
              Франшиза проката<br />электро-велосипедов
            </h1>
            <div className="inline-block bg-primary text-white px-6 md:px-8 py-3 md:py-4 mb-8 md:mb-12">
              <p className="text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">Минимальные инвестиции</p>
              <p className="text-3xl md:text-5xl font-bold">1 490 000 ₽</p>
            </div>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4">
              Откройте прибыльный бизнес в быстрорастущей нише эко-транспорта
            </p>
            <Button onClick={() => scrollToSection('contact')} size="lg" className="bg-primary hover:bg-primary/90 text-base md:text-lg px-8 md:px-12 py-4 md:py-6 h-auto">
              Получить презентацию
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 md:py-20 bg-muted/30 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center text-secondary">О франшизе</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-secondary">Что вы получаете</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Check" size={16} className="text-white" />
                  </div>
                  <span className="text-lg">Проверенная бизнес-модель с окупаемостью от 6 месяцев без учета паушального взноса</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Check" size={16} className="text-white" />
                  </div>
                  <span className="text-lg">Полное обучение персонала и маркетинговая поддержка</span>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Icon name="Check" size={16} className="text-white" />
                  </div>
                  <span className="text-lg">Постоянная операционная поддержка</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-secondary">Рынок и перспективы</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">350%</div>
                  <p className="text-muted-foreground">Рост рынка микромобильности за последние 3 года</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <p className="text-muted-foreground">Средняя маржинальность бизнеса</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">от 6 мес</div>
                  <p className="text-muted-foreground">Окупаемость без учета паушального взноса</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="package" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center text-secondary">Условия и пакеты</h2>
          <Card className="max-w-2xl mx-auto border-2 border-primary">
            <CardContent className="p-6 md:p-12">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-secondary">Стартовый пакет</h3>
                <p className="text-sm md:text-base text-muted-foreground">Всё необходимое для запуска бизнеса</p>
              </div>
              <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                <div className="flex justify-between items-center pb-3 md:pb-4 border-b">
                  <span className="text-sm md:text-lg">Паушальный взнос</span>
                  <span className="text-lg md:text-2xl font-bold text-secondary">490 000 ₽</span>
                </div>
                <div className="flex justify-between items-center pb-3 md:pb-4 border-b">
                  <span className="text-sm md:text-lg">Инвестиции в парк</span>
                  <span className="text-lg md:text-2xl font-bold text-secondary">от 1 000 000 ₽</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 pt-3 md:pt-4 bg-muted/30 p-4 md:p-6 rounded-lg">
                  <span className="text-base md:text-xl font-bold">Общие минимальные вложения</span>
                  <span className="text-2xl md:text-3xl font-bold text-primary">1 490 000 ₽</span>
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <h4 className="font-bold text-lg mb-4">В стоимость включено:</h4>
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <span>Парк из 10+ электро-велосипедов</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Smartphone" size={20} className="text-primary" />
                  <span>Система управления</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="GraduationCap" size={20} className="text-primary" />
                  <span>Обучение команды</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" size={20} className="text-primary" />
                  <span>Маркетинговые материалы</span>
                </div>
              </div>
              <Button onClick={() => scrollToSection('contact')} className="w-full bg-secondary hover:bg-secondary/90 h-12 md:h-14 text-base md:text-lg">
                Забронировать территорию
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="benefits" className="py-12 md:py-20 bg-muted/30 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center text-secondary">Преимущества бизнеса</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Zap" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Быстрый старт</h3>
              <p className="text-muted-foreground">Запуск бизнеса за 30 дней с момента подписания договора</p>
            </Card>
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="MapPin" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Закрытые территории</h3>
              <p className="text-muted-foreground">Эксклюзивные права на вашу географическую зону</p>
            </Card>
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="LineChart" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Растущий рынок</h3>
              <p className="text-muted-foreground">Спрос на эко-транспорт увеличивается на 40% ежегодно</p>
            </Card>
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Минимум персонала</h3>
              <p className="text-muted-foreground">Для работы достаточно 2-3 сотрудников</p>
            </Card>
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Calendar" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Круглогодичный доход</h3>
              <p className="text-muted-foreground">Возможность работы в помещениях в зимний период</p>
            </Card>
            <Card className="text-center p-6 md:p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Settings" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-secondary">Автоматизация</h3>
              <p className="text-muted-foreground">Умная система управляет всеми процессами бизнеса</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="success" className="py-12 md:py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-center text-secondary">История успеха основателя</h2>
          
          <Card className="border-2 border-primary">
            <CardContent className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold flex-shrink-0">
                  А
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-secondary">Айтуган</h3>
                  <p className="text-base md:text-xl text-muted-foreground">Основатель компании Доставело, Уфа</p>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
                <p>
                  <strong>Декабрь 2024 года</strong> — увидел нишу велошеринга в Москве и начал изучать спрос в своем городе Уфа. 
                  Проанализировав рынок, понял, что у этой ниши огромный потенциал.
                </p>
                
                <div className="bg-primary/10 p-4 md:p-6 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-base md:text-xl text-primary">
                    Февраль 2025 — Закупил первые 20 байков. Вся партия ушла в аренду за неделю!
                  </p>
                </div>
                
                <p>
                  <strong>Апрель 2025</strong> — привлек инвестиции на 2 000 000 ₽ и закупил еще 40 байков. 
                  В стоимость вошли велосипеды, система ГЛОНАСС, доставка и модернизация. Партия была отправлена 
                  в прокат чуть больше чем за 2 недели с учетом сборки.
                </p>
                
                <p>
                  <strong>Начало лета 2025</strong> — докупил еще 54 байка. <strong>К середине лета парк вырос до 130 велосипедов!</strong>
                </p>
                
                <div className="bg-secondary/10 p-4 md:p-6 rounded-lg border-l-4 border-secondary">
                  <p className="font-semibold text-base md:text-xl text-secondary">
                    Сегодня я — один из крупнейших шеринговых парков в Уфе. Работаю с Яндекс Доставка, 
                    Самокат, Купер и другими службами доставки.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t-2">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">130</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Байков в парке</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-secondary mb-1 md:mb-2">6 мес</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Рост с 20 до 130</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">2+ млн</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Инвестиций</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-secondary mb-1 md:mb-2">#1</div>
                  <div className="text-xs md:text-sm text-muted-foreground">В регионе</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/30 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center text-secondary">Отзывы с Авито</h2>
            <Button 
              onClick={updateReviews} 
              disabled={isUpdatingReviews}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Icon name={isUpdatingReviews ? "Loader2" : "RefreshCw"} size={16} className={isUpdatingReviews ? "animate-spin" : ""} />
              {isUpdatingReviews ? 'Обновление...' : 'Обновить'}
            </Button>
          </div>
          <p className="text-center text-muted-foreground mb-8 md:mb-16 text-sm md:text-lg">Реальные отзывы наших клиентов</p>
          
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {reviews.map((review, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{review.text}</p>
                  <p className="font-semibold text-secondary">{review.author}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Отзывы загружаются...</p>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-12 md:py-20 bg-secondary text-white px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Оставьте заявку</h2>
            <p className="text-base md:text-xl opacity-90">Получите презентацию и финансовую модель бизнеса</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <Input
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 md:h-14"
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Телефон"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 md:h-14"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 md:h-14"
              />
            </div>
            <div>
              <Textarea
                placeholder="Расскажите о себе и вашем городе"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-24 md:min-h-32"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-12 md:h-14 text-base md:text-lg">
              Получить презентацию
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-muted/30 py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <img 
                src="https://cdn.poehali.dev/files/5680030b-a296-4855-a363-45910d40a22d.png" 
                alt="Доставело" 
                className="h-12 md:h-16 mb-3 md:mb-4"
              />
              <p className="text-sm md:text-base text-muted-foreground">Франшиза проката электро-велосипедов нового поколения</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-secondary">Контакты</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (964) 964-44-11</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>low.ufa@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p>© 2025 DOSTAVELO FRANCHISE. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;