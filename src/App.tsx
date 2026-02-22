/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Trophy, 
  GraduationCap,
  Info,
  ExternalLink,
  ChevronLeft,
  Volume2,
  Loader2,
  Volume1
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { QUESTIONS } from './data/questions';
import { Question, UserAnswer, Difficulty, GrammarCategory } from './types';

// --- Components ---

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'info' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const ExplanationCard = ({ question, userAnswers, onClose }: { question: Question, userAnswers: Record<string, string>, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">语法详解</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <XCircle size={24} className="text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
          {question.blanks.map((blank, idx) => {
            const selectedOptionId = userAnswers[blank.id];
            const selectedOption = blank.options.find(o => o.id === selectedOptionId);
            const isCorrect = selectedOption?.isCorrect;

            return (
              <div key={blank.id} className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">正确答案</p>
                    <p className="text-2xl font-bold text-slate-900">{blank.correctAnswer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <Info size={16} className="text-indigo-500" />
                      语法规则
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {blank.explanation.rule}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <GraduationCap size={16} className="text-emerald-500" />
                      经典例句
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      "{blank.explanation.example}"
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <h4 className="text-sm font-bold text-rose-800 mb-2">常见错误辨析</h4>
                  <p className="text-rose-700 text-sm">{blank.explanation.commonMistake}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3">想要深入学习？推荐复习：</p>
            <div className="flex flex-wrap gap-2">
              <a href="#" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
                {question.category} 专题讲解 <ExternalLink size={12} />
              </a>
              <span className="text-slate-300">|</span>
              <a href="#" className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
                初中英语语法必背 100 句 <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            继续练习
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentIdx];

  const speakText = async (text: string, id: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlayingId(id);

    // Fallback function using browser's native SpeechSynthesis
    const useNativeFallback = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        setIsPlaying(false);
        setPlayingId(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setPlayingId(null);
      };
      window.speechSynthesis.speak(utterance);
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate: 24000 });
        
        const arrayBuffer = bytes.buffer;
        const dataView = new DataView(arrayBuffer);
        const numSamples = Math.floor(arrayBuffer.byteLength / 2);
        const float32Data = new Float32Array(numSamples);
        
        for (let i = 0; i < numSamples; i++) {
          const sample = dataView.getInt16(i * 2, true);
          float32Data[i] = sample / 32768.0;
        }

        const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          setIsPlaying(false);
          setPlayingId(null);
          audioContext.close();
        };

        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        source.start();
      } else {
        console.warn("No audio data from Gemini TTS, falling back to native speech");
        useNativeFallback();
      }
    } catch (error) {
      console.error("Gemini TTS Error, falling back to native speech:", error);
      useNativeFallback();
    }
  };

  const playSentence = () => {
    // Construct the full sentence for TTS
    let fullSentence = currentQuestion.sentence;
    currentQuestion.blanks.forEach((blank, idx) => {
      const selectedOptionId = userAnswers[blank.id];
      const selectedOption = blank.options.find(o => o.id === selectedOptionId);
      const textToUse = selectedOption ? selectedOption.text : "blank";
      fullSentence = fullSentence.replace(`[[${idx}]]`, textToUse);
    });
    speakText(fullSentence, 'sentence');
  };

  const handleOptionSelect = (blankId: string, optionId: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [blankId]: optionId }));
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length < currentQuestion.blanks.length) {
      alert('请先完成所有填空！');
      return;
    }

    let isCorrect = true;
    currentQuestion.blanks.forEach(blank => {
      const selectedOption = blank.options.find(o => o.id === userAnswers[blank.id]);
      if (!selectedOption?.isCorrect) isCorrect = false;
    });

    if (isCorrect) setScore(prev => prev + 1);
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setIsSubmitted(false);
    setUserAnswers({});
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const renderSentence = () => {
    const parts = currentQuestion.sentence.split(/(\[\[\d+\]\])/);
    return (
      <div className="text-2xl md:text-3xl font-medium text-slate-800 leading-relaxed tracking-tight">
        {parts.map((part, i) => {
          const match = part.match(/\[\[(\d+)\]\]/);
          if (match) {
            const blankIdx = parseInt(match[1]);
            const blank = currentQuestion.blanks[blankIdx];
            const selectedOptionId = userAnswers[blank.id];
            const selectedOption = blank.options.find(o => o.id === selectedOptionId);
            
            let statusClass = "border-slate-300 text-slate-400";
            if (isSubmitted) {
              statusClass = selectedOption?.isCorrect 
                ? "border-emerald-500 text-emerald-600 bg-emerald-50" 
                : "border-rose-500 text-rose-600 bg-rose-50";
            } else if (selectedOption) {
              statusClass = "border-indigo-500 text-indigo-600 bg-indigo-50";
            }

            return (
              <span 
                key={i} 
                className={`inline-block min-w-[120px] px-4 py-1 mx-2 border-b-4 transition-all duration-300 text-center ${statusClass}`}
              >
                {selectedOption ? selectedOption.text : '______'}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  const getEncouragement = () => {
    const ratio = score / QUESTIONS.length;
    if (ratio === 1) return "太棒了！你是语法大师！🌟";
    if (ratio >= 0.8) return "非常出色！继续保持！🚀";
    if (ratio >= 0.6) return "做得不错，再接再厉！💪";
    return "别灰心，多练习一定会进步的！📚";
  };

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-xl p-12 max-w-lg w-full text-center space-y-8 border border-slate-100"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
              <Trophy size={64} className="text-indigo-500" />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-2 -right-2 bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white"
            >
              {Math.round((score / QUESTIONS.length) * 100)}
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900">练习结束!</h2>
            <p className="text-slate-500 font-medium">{getEncouragement()}</p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">得分</p>
              <p className="text-3xl font-black text-slate-900">{score} <span className="text-lg text-slate-400">/ {QUESTIONS.length}</span></p>
            </div>
            <div className="text-center border-l border-slate-200">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">正确率</p>
              <p className="text-3xl font-black text-slate-900">{Math.round((score / QUESTIONS.length) * 100)}%</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={resetQuiz}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95"
            >
              <RotateCcw size={20} /> 再练一次
            </button>
            <button className="w-full py-4 bg-white text-slate-600 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              返回课程列表
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">语法大师</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">互动练习应用</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex gap-1 mb-1">
                {QUESTIONS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                      i < currentIdx ? 'bg-emerald-400' : i === currentIdx ? 'bg-indigo-500 w-10' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">进度: {currentIdx + 1} / {QUESTIONS.length}</p>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <Info size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Question Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info">{currentQuestion.category}</Badge>
            <Badge variant={
              currentQuestion.difficulty === Difficulty.Beginner ? 'success' :
              currentQuestion.difficulty === Difficulty.Intermediate ? 'warning' : 'error'
            }>
              {currentQuestion.difficulty}
            </Badge>
          </div>

          {/* Question Card */}
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500" />
            
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em]">题目 {currentIdx + 1}</span>
                  <button 
                    onClick={playSentence}
                    disabled={isPlaying}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      playingId === 'sentence'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : isPlaying 
                          ? 'bg-indigo-50 text-indigo-300 cursor-not-allowed'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'
                    }`}
                  >
                    {playingId === 'sentence' ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                    {playingId === 'sentence' ? '正在朗读...' : '朗读句子'}
                  </button>
                </div>
                {renderSentence()}
              </div>

              <div className="space-y-8">
                {currentQuestion.blanks.map((blank, bIdx) => (
                  <div key={blank.id} className="space-y-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">请选择正确的语法结构：</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {blank.options.map((option) => {
                        const isSelected = userAnswers[blank.id] === option.id;
                        let btnClass = "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
                        
                        if (isSelected) {
                          btnClass = "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100";
                        }
                        
                        if (isSubmitted) {
                          if (option.isCorrect) {
                            btnClass = "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100";
                          } else if (isSelected && !option.isCorrect) {
                            btnClass = "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100";
                          } else {
                            btnClass = "bg-slate-50 text-slate-300 border-slate-100 opacity-50";
                          }
                        }

                        return (
                          <div key={option.id} className="relative group">
                            <button
                              disabled={isSubmitted}
                              onClick={() => handleOptionSelect(blank.id, option.id)}
                              className={`w-full px-6 py-4 rounded-2xl font-bold text-lg border-2 transition-all active:scale-95 flex items-center justify-center gap-2 ${btnClass}`}
                            >
                              {option.text}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakText(option.text, option.id);
                              }}
                              disabled={isPlaying && playingId !== option.id}
                              className={`absolute -top-2 -right-2 p-2 rounded-full border shadow-sm transition-all ${
                                playingId === option.id
                                  ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                                  : 'bg-white text-slate-400 border-slate-100 hover:text-indigo-600 hover:border-indigo-200'
                              }`}
                              title="朗读选项"
                            >
                              {playingId === option.id ? <Loader2 size={12} className="animate-spin" /> : <Volume1 size={12} />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0 || isSubmitted}
                className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
              <p className="text-sm font-bold text-slate-400">
                第 <span className="text-slate-900">{currentIdx + 1}</span> 题，共 {QUESTIONS.length} 题
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {isSubmitted ? (
                <>
                  <button 
                    onClick={() => setShowExplanation(true)}
                    className="flex-1 md:flex-none px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen size={20} /> 查看详解
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex-1 md:flex-none px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
                  >
                    下一题 <ChevronRight size={20} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  提交答案
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && (
          <ExplanationCard 
            question={currentQuestion} 
            userAnswers={userAnswers} 
            onClose={() => setShowExplanation(false)} 
          />
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
        &copy; 2026 语法大师教育 • 精雕细琢，追求卓越
      </footer>
    </div>
  );
}
