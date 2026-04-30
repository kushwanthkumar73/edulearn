import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Play, Lock, Brain, Download } from 'lucide-react';
import { getLesson, getLessons, updateProgress, generateQuiz } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PlayerPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchData();
  }, [lessonId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lessonRes, lessonsRes] = await Promise.all([
        getLesson(lessonId),
        getLessons(courseId)
      ]);
      setLesson(lessonRes.data);
      setLessons(lessonsRes.data);

      // Mark lesson as complete
      await updateProgress(courseId, { lessonId });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setShowQuiz(true);
    try {
      const res = await generateQuiz({
        lessonContent: lesson.description || lesson.title,
        numQuestions: 5
      });
      setQuiz(res.data.quiz);
    } catch (err) {
      alert('Error generating quiz!');
    }
    setQuizLoading(false);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const getScore = () => {
    if (!quiz) return 0;
    return quiz.filter((q, i) => selectedAnswers[i] === q.answer).length;
  };

  const currentIndex = lessons.findIndex(l => l._id === lessonId);
  const prevLesson = lessons[currentIndex - 1];
  const nextLesson = lessons[currentIndex + 1];

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/40">Loading lesson...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0A1628' }}>

      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition mb-3"
          >
            <ChevronLeft size={16} /> Back to Course
          </button>
          <h2 className="text-white font-semibold text-sm line-clamp-2">Course Player</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {lessons.map((l, i) => (
            <button
              key={l._id}
              onClick={() => navigate(`/learn/${courseId}/${l._id}`)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-left transition ${
                l._id === lessonId
                  ? 'bg-purple-600/20 border border-purple-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                l._id === lessonId
                  ? 'bg-purple-600'
                  : 'bg-white/10'
              }`}>
                {l._id === lessonId
                  ? <Play size={12} color="white" />
                  : <span className="text-white/40 text-xs">{i + 1}</span>
                }
              </div>
              <span className={`text-sm line-clamp-2 ${
                l._id === lessonId ? 'text-white font-medium' : 'text-white/50'
              }`}>
                {l.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
          <h1 className="text-white font-semibold">{lesson?.title}</h1>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm">
              {currentIndex + 1} / {lessons.length}
            </span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Video Player */}
          <div className="bg-black relative" style={{ paddingTop: '42%' }}>
            {lesson?.videoUrl ? (
              <video
                src={lesson.videoUrl}
                controls
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(108,99,255,0.3)' }}>
                    <Play size={32} color="#6C63FF" />
                  </div>
                  <p className="text-white/40 text-sm">Video will appear here</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 max-w-4xl">
            {/* Lesson Info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">{lesson?.title}</h2>
              {lesson?.description && (
                <p className="text-white/50 leading-relaxed">{lesson.description}</p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mb-6">
              {prevLesson && (
                <button
                  onClick={() => navigate(`/learn/${courseId}/${prevLesson._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm transition"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              )}
              {nextLesson && (
                <button
                  onClick={() => navigate(`/learn/${courseId}/${nextLesson._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm transition hover:opacity-90"
                  style={{ backgroundColor: '#6C63FF' }}
                >
                  Next Lesson <ChevronRight size={16} />
                </button>
              )}
              <button
                onClick={handleGenerateQuiz}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm transition hover:opacity-90 ml-auto"
                style={{ backgroundColor: '#F97316' }}
              >
                <Brain size={16} /> AI Quiz
              </button>
            </div>

            {/* Quiz Section */}
            {showQuiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Brain size={20} color="#F97316" />
                  <h3 className="text-white font-bold text-lg">AI Generated Quiz</h3>
                </div>

                {quizLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/40">Generating quiz with AI...</p>
                  </div>
                ) : quiz ? (
                  <div className="space-y-6">
                    {quiz.map((q, qi) => (
                      <div key={qi} className="space-y-3">
                        <p className="text-white font-medium">
                          {qi + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => {
                            const isSelected = selectedAnswers[qi] === opt;
                            const isCorrect = quizSubmitted && opt === q.answer;
                            const isWrong = quizSubmitted && isSelected && opt !== q.answer;

                            return (
                              <button
                                key={oi}
                                onClick={() => !quizSubmitted && setSelectedAnswers({ ...selectedAnswers, [qi]: opt })}
                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                                  isCorrect ? 'border-green-500 bg-green-500/20 text-green-400' :
                                  isWrong ? 'border-red-500 bg-red-500/20 text-red-400' :
                                  isSelected ? 'border-purple-500 bg-purple-500/20 text-white' :
                                  'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        className="w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
                        style={{ backgroundColor: '#6C63FF' }}
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <div className="text-center p-6 rounded-xl" style={{ backgroundColor: 'rgba(108,99,255,0.15)' }}>
                        <p className="text-4xl font-bold text-white mb-2">
                          {getScore()}/{quiz.length}
                        </p>
                        <p className="text-white/60">
                          {getScore() === quiz.length ? '🎉 Perfect score!' :
                           getScore() >= quiz.length / 2 ? '👍 Good job!' :
                           '📚 Keep studying!'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;