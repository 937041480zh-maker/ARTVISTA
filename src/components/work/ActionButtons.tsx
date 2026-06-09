'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { DollarSign, User, Check } from 'lucide-react';

interface ActionButtonsProps {
  workTitle: string;
}

export function ActionButtons({ workTitle }: ActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'buy' | 'hire'>('buy');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
    }, 2000);
  };

  const openBuyModal = () => {
    setModalType('buy');
    setIsModalOpen(true);
  };

  const openHireModal = () => {
    setModalType('hire');
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button size="md" onClick={openBuyModal} icon={<DollarSign className="w-4 h-4" />}>
          购买资产
        </Button>
        <Button variant="secondary" size="md" onClick={openHireModal} icon={<User className="w-4 h-4" />}>
          联系委托
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'buy' ? '购买资产' : '联系委托'}
      >
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/15 flex items-center justify-center">
                <Check className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-1">消息已发送</h3>
              <p className="text-text-secondary text-sm">艺术家会尽快与您联系</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <p className="text-text-secondary text-sm mb-4">
                您正在联系关于 <span className="text-text-primary font-medium">{workTitle}</span> 的{modalType === 'buy' ? '购买' : '委托'}事宜
              </p>
              
              <Input
                label="您的姓名"
                placeholder="请输入您的姓名"
                required
              />
              
              <Input
                label="邮箱地址"
                type="email"
                placeholder="your@email.com"
                required
              />
              
              <Textarea
                label="留言内容"
                placeholder={modalType === 'buy' 
                  ? "请描述您的使用场景和需求..." 
                  : "请描述您的委托需求、预算和时间..."}
                required
              />
              
              <Button type="submit" size="md" className="w-full mt-5">
                发送消息
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}
