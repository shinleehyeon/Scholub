import { Input, Checkbox, Button, Search, Chip } from "@/shared/ui";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Discussion } from "@/widgets/discussion";
import MessageBubble from "@/shared/ui/icons/MessageBubble";

export default function ComponentTest() {
  const navigate = useNavigate();
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [chip1, setChip1] = useState(false);
  const [chip2, setChip2] = useState(false);
  const [chip3, setChip3] = useState(false);
  const [chip4, setChip4] = useState(false);
  const [chip5, setChip5] = useState(false);
  const [chip6, setChip6] = useState(false);

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Button</span>
          </div>

          <div className="space-y-12 mr-12">
            <Button variant="primary" size="medium">
              텍스트
            </Button>

            <Button
              variant="primary"
              size="large"
              trailingIcon={<ArrowRight />}
            >
              텍스트
            </Button>

            <Button
              variant="secondary"
              size="medium"
              leadingIcon={<MessageBubble color="var(--color-text-subtle)" />}
              onClick={() => navigate("/newscolar")}
            >
              AI 탭으로 이동
            </Button>

            <Button
              variant="secondary"
              size="medium"
              leadingIcon={<MessageBubble color="var(--color-text-subtle)" />}
              trailingIcon={<ArrowRight />}
              onClick={() => navigate("/")}
            >
              홈으로 이동
            </Button>

            <Button
              variant="tertiary"
              size="large"
              leadingIcon={<ArrowRight />}
              onClick={() => navigate("/login")}
            >
              로그인 페이지로 이동
            </Button>

            <Button
              variant="primary"
              size="large"
              leadingIcon={<MessageBubble color="var(--color-text-white)" />}
              onClick={() => navigate("/newscolar")}
            >
              AI 답변 보기
            </Button>

            <Button
              variant="secondary"
              size="large"
              leadingIcon={<MessageBubble color="var(--color-text-subtle)" />}
              trailingIcon={<ArrowRight />}
              onClick={() => navigate("/")}
            >
              홈으로 이동
            </Button>

            <Button
              variant="primary"
              size="large"
              trailingIcon={<MessageBubble />}
              onClick={() => navigate("/register")}
            >
              회원가입
            </Button>
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Checkbox</span>
          </div>

          <div className="space-y-12">
            <Checkbox
              size="lg"
              label="약관에 동의해주세요"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
            />

            <Checkbox
              size="lg"
              label="약관에 동의해주세요"
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
              indeterminate
            />

            <Checkbox
              size="lg"
              label="약관에 동의해주세요"
              checked={checked4}
              onChange={(e) => setChecked4(e.target.checked)}
              disabled
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Input</span>
          </div>

          <div className="space-y-8">
            <Input size="small" placeholder="이름을 입력해주세요" />

            <Input size="large" placeholder="이름을 입력해주세요" />

            <Input
              size="small"
              label="이름"
              placeholder="이름을 입력해주세요"
              required
            />

            <Input
              size="large"
              label="이름"
              placeholder="이름을 입력해주세요"
              required
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Search</span>
          </div>

          <div className="space-y-8">
            <Search />
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Chip</span>
          </div>

          <div className="space-y-8 flex flex-wrap gap-4">
            <Chip
              status={chip1 ? "selected" : "default"}
              size="small"
              onClick={() => setChip1(!chip1)}
            >
              태그
            </Chip>

            <Chip
              status={chip2 ? "selected" : "default"}
              size="small"
              onClick={() => setChip2(!chip2)}
            >
              선택됨
            </Chip>

            <Chip
              status={chip3 ? "selected" : "default"}
              size="small"
              leadingIcon={<ArrowRight size={12} />}
              onClick={() => setChip3(!chip3)}
            >
              아이콘 태그
            </Chip>

            <Chip
              status={chip4 ? "selected" : "default"}
              size="small"
              trailingIcon={<ArrowRight size={12} />}
              onClick={() => setChip4(!chip4)}
            >
              태그 아이콘
            </Chip>

            <Chip
              status={chip5 ? "selected" : "default"}
              size="large"
              onClick={() => setChip5(!chip5)}
            >
              큰 태그
            </Chip>

            <Chip
              status={chip6 ? "selected" : "default"}
              size="large"
              onClick={() => setChip6(!chip6)}
            >
              큰 선택된 태그
            </Chip>
          </div>
        </div>

        <div className="border-2 border-dashed border-purple-500 rounded-3xl p-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-purple-500 font-semibold">Discussion</span>
          </div>

          <Discussion />
        </div>
      </div>
    </div>
  );
}
