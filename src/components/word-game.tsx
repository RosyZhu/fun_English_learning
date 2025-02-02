import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type { Word, Mistake } from '../types/word';

const GAME_DURATION = 50;
const INCORRECT_ANSWER_DELAY = 2000;

// 在这里添加 styles 对象，在所有常量定义之后，组件定义之前
const styles = {
  background: "bg-blue-50",
  card: "bg-white",
  text: "text-blue-900",
  subtext: "text-blue-700",
  buttonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
  buttonOutline: "border-blue-600 text-blue-600 hover:bg-blue-50",
  buttonSecondary: "bg-blue-100 hover:bg-blue-200 text-blue-800",
  success: "text-blue-600",
  error: "text-red-500"
};

const wordDatabase: Word[] = [
  { english: "traveller", chinese: "旅行者" },
  // ... rest of your word database
];

const WordGuessingGame = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over' | 'review'>('start');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            endGame();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const endGame = () => {
    setIsActive(false);
    setGameState('over');
  };

  const getWrongAnswers = (correctAnswer: string): string[] => {
    const otherAnswers = wordDatabase
      .filter(word => word.chinese !== correctAnswer)
      .map(word => word.chinese);
    return shuffleArray(otherAnswers).slice(0, 3);
  };

  const initializeGame = () => {
    const availableWords = wordDatabase.filter(word => !usedWords.has(word.english));
    if (availableWords.length === 0) {
      setUsedWords(new Set());
    }
    const words = availableWords.length === 0 ? wordDatabase : availableWords;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const wrongAnswers = getWrongAnswers(randomWord.chinese);
    const shuffledOptions = shuffleArray([randomWord.chinese, ...wrongAnswers]);
    
    setCurrentWord(randomWord);
    setOptions(shuffledOptions);
    setSelectedAnswer(null);
    setUsedWords(prev => new Set([...prev, randomWord.english]));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    setGameState('playing');
    setIsActive(true);
    initializeGame();
  };

  const handleAnswer = (answer: string, isSkip = false) => {
    if (!isActive || selectedAnswer !== null || !currentWord) return;
    
    setSelectedAnswer(answer);
    const isCorrect = !isSkip && answer === currentWord.chinese;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setTimeout(moveToNextQuestion, 500);
    } else {
      setMistakes(prev => [...prev, {
        english: currentWord.english,
        chinese: currentWord.chinese,
        selectedAnswer: isSkip ? "Skipped" : answer
      }]);
      setTimeout(moveToNextQuestion, INCORRECT_ANSWER_DELAY);
    }
  };

  const moveToNextQuestion = () => {
    if (!isActive) return;
    setCurrentQuestionNumber(prev => prev + 1);
    initializeGame();
  };

  const handleReset = () => {
    setScore(0);
    setCurrentQuestionNumber(1);
    setUsedWords(new Set());
    setTimeRemaining(GAME_DURATION);
    setIsActive(false);
    setSelectedAnswer(null);
    setMistakes([]);
    setGameState('start');
  };

  // ... rest of your component code (render methods) stays the same

  return (
    // Start screen
    if (gameState === 'start') {
      return (
        <div className={`min-h-screen ${styles.background} py-8`}>
          <div className="max-w-2xl mx-auto p-4">
            <Card className={styles.card}>
              <CardContent className="p-6 text-center">
                <h1 className={`text-3xl font-bold mb-4 ${styles.text}`}>
                  Chinese Word Game
                </h1>
                <p className={`text-lg mb-6 ${styles.subtext}`}>
                  测试你的中文词汇量！你有 {GAME_DURATION} 秒的时间回答尽可能多的题目。
                </p>
                <Button 
                  onClick={startGame} 
                  className={`w-full text-lg h-16 ${styles.buttonPrimary}`}
                >
                  开始游戏
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Game screen
    if (gameState === 'playing' && currentWord) {
      return (
        <div className={`min-h-screen ${styles.background} py-8`}>
          <div className="max-w-2xl mx-auto p-4">
            <Card className={styles.card}>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-lg font-semibold ${styles.text}`}>
                      剩余时间：{timeRemaining}秒
                    </span>
                    <span className={`text-lg font-semibold ${styles.text}`}>
                      得分：{score}
                    </span>
                  </div>
                  <Progress 
                    value={(timeRemaining / GAME_DURATION) * 100} 
                    className="h-2 bg-blue-100"
                  />
                </div>

                <div className="text-center mb-6">
                  <h2 className={`text-2xl font-bold mb-2 ${styles.text}`}>
                    第 {currentQuestionNumber} 题
                  </h2>
                  <p className={`text-xl ${styles.text}`}>
                    翻译：<span className="font-bold">{currentWord.english}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => !selectedAnswer && handleAnswer(option)}
                        className={`h-16 text-lg ${
                          selectedAnswer
                            ? option === currentWord.chinese
                              ? styles.buttonPrimary
                              : option === selectedAnswer
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : styles.buttonOutline
                            : styles.buttonOutline
                        }`}
                        disabled={selectedAnswer !== null}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => !selectedAnswer && handleAnswer("跳过", true)}
                    className={`h-12 text-lg w-full ${styles.buttonSecondary}`}
                    disabled={selectedAnswer !== null}
                  >
                    跳过
                  </Button>
                </div>

                {selectedAnswer && (
                  <Alert className={selectedAnswer === currentWord.chinese ? "bg-blue-50" : "bg-red-50"}>
                    <AlertDescription className={selectedAnswer === currentWord.chinese ? styles.success : styles.error}>
                      {selectedAnswer === currentWord.chinese
                        ? "正确！🎉"
                        : `错误。正确答案是：${currentWord.chinese}`}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Game over screen
    if (gameState === 'over') {
      const isPerfectScore = score === currentQuestionNumber - 1 && score > 0;
      return (
        <div className={`min-h-screen ${styles.background} py-8`}>
          <div className="max-w-2xl mx-auto p-4">
            <Card className={styles.card}>
              <CardContent className="p-6 text-center">
                {isPerfectScore ? (
                  <>
                    <style>
                      {`
                        @keyframes bouncetwice {
                          0%, 100% { transform: translateY(0); }
                          25%, 75% { transform: translateY(-15px); }
                          50% { transform: translateY(0); }
                        }
                        .bounce-twice {
                          animation: bouncetwice 2s ease-in-out;
                          animation-iteration-count: 1;
                        }
                      `}
                    </style>
                    <h2 className={`text-4xl font-bold mb-6 ${styles.success} bounce-twice`}>
                      全对！太棒了！
                    </h2>
                    <div className="text-6xl mb-8">🎉</div>
                  </>
                ) : (
                  <h2 className={`text-2xl font-bold mb-4 ${styles.text}`}>
                    时间到！
                  </h2>
                )}
                
                <div className="space-y-2 mb-8">
                  <p className={`text-lg ${styles.text}`}>答题数量：{currentQuestionNumber - 1}</p>
                  <p className={`text-lg ${styles.text}`}>正确答案：{score}</p>
                  <p className={`text-lg ${styles.text}`}>
                    正确率：{Math.round((score / (currentQuestionNumber - 1)) * 100) || 0}%
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  {mistakes.length > 0 && (
                    <Button 
                      onClick={() => setGameState('review')} 
                      className={`w-full text-lg ${styles.buttonOutline}`}
                    >
                      查看错题 ({mistakes.length})
                    </Button>
                  )}
                  <Button 
                    onClick={handleReset}
                    className={`w-full text-lg ${styles.buttonPrimary}`}
                  >
                    再次挑战
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Review screen
    if (gameState === 'review') {
      const skippedWords = mistakes.filter(m => m.selectedAnswer === "Skipped");
      const wrongAnswers = mistakes.filter(m => m.selectedAnswer !== "Skipped");

      return (
        <div className={`min-h-screen ${styles.background} py-8`}>
          <div className="max-w-2xl mx-auto p-4">
            <Card className={styles.card}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className={`text-2xl font-bold ${styles.text}`}>复习</h2>
                  <Button 
                    onClick={() => setGameState('over')}
                    className={`px-4 ${styles.buttonOutline}`}
                  >
                    返回
                  </Button>
                </div>
                
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {wrongAnswers.length > 0 && (
                    <div className="mb-6">
                      <h3 className={`text-lg font-semibold mb-3 ${styles.text}`}>
                        答错的单词 ({wrongAnswers.length})
                      </h3>
                      <div className="divide-y divide-blue-100">
                        {wrongAnswers.map((mistake, index) => (
                          <div key={index} className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className={`text-lg font-medium ${styles.text}`}>
                                  {mistake.english}
                                </div>
                                <div className={styles.error}>
                                  你的答案：{mistake.selectedAnswer}
                                </div>
                              </div>
                              <div className={`text-lg font-medium ${styles.success} ml-8`}>
                                {mistake.chinese}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {skippedWords.length > 0 && (
                    <div>
                      <h3 className={`text-lg font-semibold mb-3 ${styles.text}`}>
                        跳过的单词 ({skippedWords.length})
                      </h3>
                      <div className="divide-y divide-blue-100">
                        {skippedWords.map((mistake, index) => (
                          <div key={index} className="py-4">
                            <div className="flex justify-between items-center">
                              <div className={`text-lg font-medium ${styles.text}`}>
                                {mistake.english}
                              </div>
                              <div className={`text-lg font-medium ${styles.success} ml-8`}>
                                {mistake.chinese}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mistakes.length === 0 && (
                    <p className={`text-center text-lg py-8 ${styles.success}`}>
                      恭喜！全部回答正确！🎉
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={handleReset}
                    className={`w-full ${styles.buttonPrimary}`}
                  >
                    重新开始
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return null; // Fallback return
  );
};

export default WordGuessingGame;