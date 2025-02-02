import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const GAME_DURATION = 50; // seconds
const INCORRECT_ANSWER_DELAY = 2000; // 2 seconds delay for incorrect answers

// Complete word database
const wordDatabase = [
  { english: "traveller", chinese: "旅行者" },
  { english: "come true", chinese: "实现" },
  { english: "pianist", chinese: "钢琴家" },
  { english: "football player", chinese: "足球运动员" },
  { english: "World Cup", chinese: "世界杯" },
  { english: "go into", chinese: "进入" },
  { english: "get out", chinese: "出去" },
  { english: "lover", chinese: "爱人" },
  { english: "zebra crossing", chinese: "斑马线" },
  { english: "cheer", chinese: "欢呼" },
  { english: "sleepy", chinese: "困倦的" },
  { english: "a little", chinese: "一点点" },
  { english: "safety", chinese: "安全" },
  { english: "koala", chinese: "考拉" },
  { english: "care about", chinese: "关心" },
  { english: "Disneyland", chinese: "迪士尼乐园" },
  { english: "Taipei", chinese: "台北" },
  { english: "Oxford", chinese: "牛津" },
  { english: "at a time", chinese: "一次" },
  { english: "Children's Day", chinese: "儿童节" },
  { english: "look out for", chinese: "留意" },
  { english: "go back to", chinese: "回去" },
  { english: "last night", chinese: "昨晚" },
  { english: "pour into", chinese: "倒入" },
  { english: "summer holiday", chinese: "暑假" },
  { english: "how long", chinese: "多久" },
  { english: "put in order", chinese: "整理" },
  { english: "just then", chinese: "就在那时" },
  { english: "Moon", chinese: "月亮" },
  { english: "London Eye", chinese: "伦敦眼" },
  { english: "Ocean Park", chinese: "海洋公园" },
  { english: "some day", chinese: "某一天" },
  { english: "the next day", chinese: "第二天" },
  { english: "walk by", chinese: "走过" },
  { english: "wake...up", chinese: "唤醒" },
  { english: "too much", chinese: "太多" },
  { english: "next week", chinese: "下周" },
  { english: "like", chinese: "喜欢" },
  { english: "London", chinese: "伦敦" },
  { english: "about", chinese: "关于" },
  { english: "from then on", chinese: "从那时起" },
  { english: "Sydney", chinese: "悉尼" },
  { english: "Big Ben", chinese: "大本钟" },
  { english: "a few", chinese: "几个" },
  { english: "Tower Bridge", chinese: "塔桥" },
  { english: "future", chinese: "未来" },
  { english: "dream", chinese: "梦想" },
  { english: "reach", chinese: "到达" },
  { english: "net", chinese: "网" },
  { english: "magazine", chinese: "杂志" },
  { english: "exciting", chinese: "令人兴奋的" },
  { english: "diet", chinese: "饮食" },
  { english: "appear", chinese: "出现" },
  { english: "bite", chinese: "咬" },
  { english: "spaceship", chinese: "飞船" },
  { english: "pavement", chinese: "人行道" },
  { english: "clown", chinese: "小丑" },
  { english: "artist", chinese: "艺术家" },
  { english: "rule", chinese: "规则" },
  { english: "cross", chinese: "穿过" },
  { english: "sharp", chinese: "锋利的" },
  { english: "astronaut", chinese: "宇航员" },
  { english: "tidy", chinese: "整洁的" },
  { english: "ground", chinese: "地面" },
  { english: "light", chinese: "光" },
  { english: "paint", chinese: "画" },
  { english: "healthy", chinese: "健康的" },
  { english: "safe", chinese: "安全" },
  { english: "finish", chinese: "完成" },
  { english: "travel", chinese: "旅行" },
  { english: "welcome", chinese: "欢迎" },
  { english: "weak", chinese: "虚弱的" },
  { english: "mouse", chinese: "鼠标" },
  { english: "need", chinese: "需要" },
  { english: "never", chinese: "从未" },
  { english: "strong", chinese: "强壮的" },
  { english: "stay", chinese: "停留" },
  { english: "late", chinese: "迟到" },
  { english: "follow", chinese: "跟随" },
  { english: "deep", chinese: "深的" },
  { english: "begin", chinese: "开始" },
  { english: "scientist", chinese: "科学家" },
  { english: "country", chinese: "国家" },
  { english: "will", chinese: "将" },
  { english: "put on", chinese: "穿上" },
  { english: "hit", chinese: "击打" },
  { english: "fast", chinese: "快速的" },
  { english: "find out", chinese: "发现" },
  { english: "large", chinese: "大的" },
  { english: "sound", chinese: "声音" },
  { english: "learn", chinese: "学习" },
  { english: "habit", chinese: "习惯" },
  { english: "balloon", chinese: "气球" },
  { english: "kangaroo", chinese: "袋鼠" },
  { english: "soon", chinese: "很快" },
  { english: "child", chinese: "孩子" },
  { english: "bad", chinese: "坏的" },
  { english: "visitor", chinese: "访客" },
  { english: "ask", chinese: "询问" },
  { english: "road", chinese: "道路" },
  { english: "must", chinese: "必须" },
  { english: "cola", chinese: "可乐" },
  { english: "dancer", chinese: "舞者" },
  { english: "happily", chinese: "愉快地" },
  { english: "loudly", chinese: "大声地" },
  { english: "quietly", chinese: "安静地" },
  { english: "safely", chinese: "安全地" },
  { english: "take care of", chinese: "照顾" }
];

const WordGuessingGame = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'over', 'review'
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [usedWords, setUsedWords] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mistakes, setMistakes] = useState([]);

  // Timer effect
  useEffect(() => {
    let interval = null;
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
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const endGame = () => {
    setIsActive(false);
    setGameState('over');
  };

  // Get random wrong answers
  const getWrongAnswers = (correctAnswer, count = 3) => {
    const otherAnswers = wordDatabase
      .filter(word => word.chinese !== correctAnswer)
      .map(word => word.chinese);
    
    return shuffleArray(otherAnswers).slice(0, count);
  };

  // Initialize or reset the game
  const initializeGame = () => {
    let availableWords = wordDatabase.filter(word => !usedWords.has(word.english));
    
    if (availableWords.length === 0) {
      setUsedWords(new Set());
      availableWords = wordDatabase;
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    const wrongAnswers = getWrongAnswers(randomWord.chinese);
    const shuffledOptions = shuffleArray([randomWord.chinese, ...wrongAnswers]);
    
    setCurrentWord(randomWord);
    setOptions(shuffledOptions);
    setSelectedAnswer(null);
    setUsedWords(prev => new Set([...prev, randomWord.english]));
  };

  // Shuffle array helper function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setIsActive(true);
    initializeGame();
  };

  // Handle answer selection
  const handleAnswer = (answer, isSkip = false) => {
    if (!isActive || selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = !isSkip && answer === currentWord.chinese;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        moveToNextQuestion();
      }, 500);
    } else {
      setMistakes(prev => [...prev, {
        english: currentWord.english,
        chinese: currentWord.chinese,
        selectedAnswer: isSkip ? "Skipped" : answer
      }]);
      setTimeout(() => {
        moveToNextQuestion();
      }, INCORRECT_ANSWER_DELAY);
    }
  };

  // Move to next question
  const moveToNextQuestion = () => {
    if (!isActive) return;
    
    setCurrentQuestionNumber(prev => prev + 1);
    initializeGame();
  };

  // Reset the game
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

  // Start screen
  if (gameState === 'start') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Chinese Word Challenge</h1>
            <p className="text-lg mb-6">
              Test your Chinese vocabulary! You have {GAME_DURATION} seconds to answer as many questions as possible.
            </p>
            <Button onClick={startGame} className="w-full text-lg h-16">
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Review mistakes screen
  if (gameState === 'review') {
    const skippedWords = mistakes.filter(m => m.selectedAnswer === "Skipped");
    const wrongAnswers = mistakes.filter(m => m.selectedAnswer !== "Skipped");

    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">复习</h2>
              <Button 
                variant="outline" 
                onClick={() => setGameState('over')}
                className="px-4"
              >
                返回
              </Button>
            </div>
            
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* Wrong answers section */}
              {wrongAnswers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-red-600">
                    答错的单词 ({wrongAnswers.length})
                  </h3>
                  <div className="divide-y">
                    {wrongAnswers.map((mistake, index) => (
                      <div key={index} className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-lg font-medium">{mistake.english}</div>
                            <div className="text-sm text-red-500 mt-1">
                              你的答案：{mistake.selectedAnswer}
                            </div>
                          </div>
                          <div className="text-lg font-medium text-green-600 ml-8">
                            {mistake.chinese}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skipped words section */}
              {skippedWords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">
                    跳过的单词 ({skippedWords.length})
                  </h3>
                  <div className="divide-y">
                    {skippedWords.map((mistake, index) => (
                      <div key={index} className="py-4">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-medium">{mistake.english}</div>
                          <div className="text-lg font-medium text-green-600 ml-8">
                            {mistake.chinese}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mistakes.length === 0 && (
                <p className="text-center text-lg py-8">恭喜！全部回答正确！🎉</p>
              )}
            </div>

            <div className="mt-6">
              <Button onClick={handleReset} className="w-full">
                重新开始
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game over screen
  if (gameState === 'over') {
    const isPerfectScore = score === currentQuestionNumber - 1 && score > 0;

    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
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
                <h2 className="text-4xl font-bold mb-6 text-green-600 bounce-twice">
                  全对！太棒了！
                </h2>
                <div className="text-6xl mb-8">🎉</div>
              </>
            ) : (
              <h2 className="text-2xl font-bold mb-4">时间到！</h2>
            )}
            
            <div className="space-y-2 mb-8">
              <p className="text-lg">答题数量：{currentQuestionNumber - 1}</p>
              <p className="text-lg">正确答案：{score}</p>
              <p className="text-lg">正确率：{Math.round((score / (currentQuestionNumber - 1)) * 100) || 0}%</p>
            </div>
            <div className="flex flex-col gap-4">
              {mistakes.length > 0 && (
                <Button 
                  onClick={() => setGameState('review')} 
                  variant="outline"
                  className="w-full text-lg"
                >
                  查看错题 ({mistakes.length})
                </Button>
              )}
              <Button onClick={handleReset} className="w-full text-lg">
                再次挑战
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game screen
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Time: {timeRemaining}s</span>
              <span className="text-lg font-semibold">Score: {score}</span>
            </div>
            <Progress value={(timeRemaining / GAME_DURATION) * 100} className="h-2" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Question {currentQuestionNumber}</h2>
            <p className="text-xl">Translate: <span className="font-bold">{currentWord.english}</span></p>
          </div>

          {/* Answer options container */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Four translation options in 2x2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => !selectedAnswer && handleAnswer(option)}
                  variant={selectedAnswer ? (
                    option === currentWord.chinese ? "default" :
                    option === selectedAnswer ? "destructive" : "outline"
                  ) : "outline"}
                  className="h-16 text-lg"
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
            {/* Skip button spanning full width */}
            <Button
              onClick={() => !selectedAnswer && handleAnswer("跳过", true)}
              variant="secondary"
              className="h-12 text-lg w-full"
              disabled={selectedAnswer !== null}
            >
              跳过
            </Button>
          </div>

          {selectedAnswer && (
            <Alert className={selectedAnswer === currentWord.chinese ? "bg-green-50" : "bg-red-50"}>
              <AlertDescription>
                {selectedAnswer === currentWord.chinese
                  ? "正确！🎉"
                  : `错误。正确答案是：${currentWord.chinese}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-6">
            <Button onClick={handleReset} variant="outline">
              重新开始
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordGuessingGame;