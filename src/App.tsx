import { Input, Checkbox, Button } from './components/ui'
import './App.css'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

function App() {
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const [checked4, setChecked4] = useState(false)

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
            
            <Button variant="primary" size="large" trailingIcon={<ArrowRight />}>
              텍스트
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
            <Input
              size="small"
              placeholder="이름을 입력해주세요"
            />
            
            <Input
              size="large"
              placeholder="이름을 입력해주세요"
            />
            
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
      </div>
    </div>
  )
}

export default App
