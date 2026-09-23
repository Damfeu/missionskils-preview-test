import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Quiz as QuizType } from "@/data/mockData";

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number) => Promise<boolean>;
}

const Quiz = ({ quiz, onComplete }: QuizProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const allAnswered = quiz.questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    const correct = quiz.questions.filter(q => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = await onComplete(score);
    setResult({ score, passed });
    setSubmitting(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className={`rounded-xl border p-5 text-center space-y-3 ${
        result.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
      }`}>
        {result.passed ? (
          <CheckCircle size={36} className="text-green-500 mx-auto" />
        ) : (
          <XCircle size={36} className="text-red-500 mx-auto" />
        )}
        <div>
          <p className={`font-bold text-lg ${result.passed ? "text-green-700" : "text-red-600"}`}>
            {result.passed ? "Questionnaire réussi ! 🎉" : "Questionnaire échoué"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Score : {result.score}% (seuil requis : {quiz.passingScore}%)
          </p>
          {result.passed ? (
            <p className="text-sm text-muted-foreground mt-1">
              La mission liée à cette compétence est maintenant débloquée.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Relisez les modules puis retentez le questionnaire.
            </p>
          )}
        </div>
        {!result.passed && (
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw size={14} className="mr-1.5" /> Réessayer
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Répondez aux {quiz.questions.length} questions. Seuil de réussite : {quiz.passingScore}%.
      </p>
      {quiz.questions.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-border p-4">
          <p className="text-sm font-semibold mb-3">{qi + 1}. {q.question}</p>
          <RadioGroup
            value={answers[q.id]?.toString() ?? ""}
            onValueChange={v => setAnswers(prev => ({ ...prev, [q.id]: Number(v) }))}
            className="space-y-2"
          >
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center space-x-2">
                <RadioGroupItem value={oi.toString()} id={`${q.id}-${oi}`} />
                <Label htmlFor={`${q.id}-${oi}`} className="text-sm font-normal cursor-pointer">
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <Button className="w-full gradient-bg border-0" onClick={handleSubmit} disabled={!allAnswered || submitting}>
        {submitting ? "Correction en cours..." : (
          <span className="flex items-center gap-2"><Send size={15} /> Valider mes réponses</span>
        )}
      </Button>
    </div>
  );
};

export default Quiz;
