"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Search, Info, FileText, DollarSign, Building, User, Plus, Package, ArrowRight, ArrowLeft, Check, X, Edit, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Toaster } from "@/components/ui/sonner";
import { Bell } from "lucide-react";
import Header from "@/components/ui/Header";


interface Item {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}


export default function CadastroDID() {
  const [date, setDate] = useState<Date>();
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({});
  const [formData, setFormData] = useState({
    processo: '',
    unidadeOrcamentaria: '',
    fornecedor: '',
    modalidade: '',
    contrato: '',
    dotacao: '',
    centroCusto: '',
    saldoCotaGasto: '',
    valorDID: '',
    descricao: ''
  });
  

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (field: string, value: string | number) => {
    setCurrentItem(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total when quantity or unit value changes
      if (field === 'quantidade' || field === 'valorUnitario') {
        const quantidade = field === 'quantidade' ? Number(value) : (updated.quantidade || 0);
        const valorUnitario = field === 'valorUnitario' ? Number(value) : (updated.valorUnitario || 0);
        updated.valorTotal = quantidade * valorUnitario;
      }
      
      return updated;
    });
  };

  const addItem = () => {
    if (currentItem.codigo && currentItem.descricao && currentItem.quantidade && currentItem.valorUnitario) {
      const newItem: Item = {
        id: Date.now().toString(),
        codigo: currentItem.codigo || '',
        descricao: currentItem.descricao || '',
        unidade: currentItem.unidade || 'UN',
        quantidade: currentItem.quantidade || 0,
        valorUnitario: currentItem.valorUnitario || 0,
        valorTotal: currentItem.valorTotal || 0
      };
      
      setItems(prev => [...prev, newItem]);
      setCurrentItem({});
      setCurrentStep(1);
    }
  };
  const unidades = ['0501', '0201', '0801'];

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.valorTotal, 0);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetItemForm = () => {
    setCurrentItem({});
    setCurrentStep(1);
  };

  const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d)(\d{3})(\d{2})$/, '$1.$2,$3').replace(/(?=(\d{3})+(\D))\B/g, '.');
  };

  const formatCurrencyDisplay = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const StepIndicator = ({ step, currentStep }: { step: number; currentStep: number }) => {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;
    
    return (
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-500 border-green-500 text-white' 
          : isActive 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'border-slate-300 text-slate-400'
      }`}>
        {isCompleted ? <Check className="h-5 w-5" /> : step}
      </div>
    );
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
{/* Header */}
<div className="bg-white shadow-sm border-b border-slate-200">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* Logo e Título */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FluxusWeb</h1>
          <p className="text-sm text-slate-600">PREFEITURA DE BATURITÊ</p>
        </div>
      </div>

      {/* Informações do Usuário e Notificações */}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col text-sm text-slate-600">
          <span>Exercício 2025</span>
          <span>Bem vindo, (usuário)</span>
        </div>

        {/* Ícone de Notificação */}
        <div className="relative">
  <Bell className="h-6 w-6 text-slate-600" />
  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
    5
  
          </span>
        </div>
      </div>
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Cadastro DID</h2>
          <p className="text-slate-600">Preencha os campos abaixo para registrar um novo Documento de Despesa</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>Informações Básicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="processo" className="text-sm font-semibold text-slate-700">
                      Processo *
                    </Label>
                    <Input
                      id="processo"
                      value={formData.processo}
                      onChange={(e) => handleInputChange('processo', e.target.value)}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="Número do processo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unidadeOrcamentaria" className="text-sm font-semibold text-slate-700">
                      Unidade Orçamentária *
                    </Label>
                    <div className="relative">
                      <Input
                        id="unidadeOrcamentaria"
                        value={formData.unidadeOrcamentaria}
                        onChange={(e) => handleInputChange('unidadeOrcamentaria', e.target.value)}
                        className="h-12 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fornecedor" className="text-sm font-semibold text-slate-700">
                    Fornecedor *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="fornecedor"
                      value={formData.fornecedor}
                      onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                      className="h-12 pl-10 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                      placeholder="Nome do fornecedor"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
  <Label htmlFor="valorDID" className="text-sm font-semibold text-slate-700">
    Valor do DID (Caso não possua contrato)
  </Label>
  <div className="relative">
    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      id="valorDID"
      type="number"
      value={formData.valorDID}
      onChange={(e) => handleInputChange('valorDID', e.target.value)}
      className="h-12 pl-10 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
      placeholder="Insira o valor do DID"
    />
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
  </div>
</div>

                

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <Label className="text-sm font-semibold text-slate-700">Modalidade</Label>
    <Select
      value={formData.modalidade}
      onValueChange={(value) => handleInputChange('modalidade', value)} // <-- atualiza o estado
    >
      <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
        <SelectValue placeholder="Selecione a modalidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Global">Global</SelectItem>
        <SelectItem value="Parcial">Ordinário</SelectItem>
        <SelectItem value="Específica">Estimativo</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

                  <div className="space-y-2">
                    <Label htmlFor="contrato" className="text-sm font-semibold text-slate-700">
                      Contrato
                    </Label>
                    <div className="relative">
                      <Input
                        id="contrato"
                        value={formData.contrato}
                        onChange={(e) => handleInputChange('contrato', e.target.value)}
                        className="h-12 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="Número do contrato"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>
              </CardContent>
            </Card>

            {/* Informações Orçamentárias */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Informações Orçamentárias</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dotacao" className="text-sm font-semibold text-slate-700">
                      Dotação *
                    </Label>
                    <Input
                      id="dotacao"
                      value={formData.dotacao}
                      onChange={(e) => handleInputChange('dotacao', e.target.value)}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Data *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal border-slate-300 hover:border-blue-500"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '09/09/2025'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="centroCusto" className="text-sm font-semibold text-slate-700">
                    Centro de Custo
                  </Label>
                  <div className="relative">
                    <Input
                      id="centroCusto"
                      value={formData.centroCusto}
                      onChange={(e) => handleInputChange('centroCusto', e.target.value)}
                      className="h-12 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Descrição da Despesa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-sm font-semibold text-slate-700">
                    Valor a ser empenhado para atender despesas com: *
                  </Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    className="min-h-[120px] border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                    placeholder="Descreva detalhadamente o objeto da despesa..."
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.descricao.length}/1000 caracteres
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itens do DID */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-slate-800">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span>Itens do DID</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">Nenhum item adicionado</p>
                    <p className="text-sm">Clique em Informar Itens para adicionar itens ao DID</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {String(index + 1).padStart(3, '0')}
                            </Badge>
                            <span className="font-medium text-slate-900">{item.codigo}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{item.descricao}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Qtd: {item.quantidade} {item.unidade}</span>
                            <span>Valor Unit.: {formatCurrencyDisplay(item.valorUnitario)}</span>
                            <span className="font-semibold text-slate-700">
                              Total: {formatCurrencyDisplay(item.valorTotal)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="font-semibold text-slate-700">Total dos Itens:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrencyDisplay(getTotalItems())}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* Resumo Financeiro */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Resumo Financeiro</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Saldo da Cota de Gasto:</span>
                    <span className="font-bold text-xl">R$ {formData.saldoCotaGasto}</span>
                  </div>
                  <div className="w-full h-px bg-blue-400"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Valor do DID:</span>
                    <span className="font-bold text-xl">R$ {formData.valorDID}</span>
                  </div>
                  {items.length > 0 && (
                    <>
                      <div className="w-full h-px bg-blue-400"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100">Total dos Itens:</span>
                        <span className="font-bold text-xl">{formatCurrencyDisplay(getTotalItems())}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="text-sm text-blue-100 mb-2">Saldo Restante:</div>
                  <div className="text-2xl font-bold">R$ 0,00</div>
                </div>
              </CardContent>
            </Card>

            {/* Informações Complementares */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Licitação:</span>
                    <span className="font-medium text-slate-800">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Contrato:</span>
                    <span className="font-medium text-slate-800">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tipo de Aquisição:</span>
                    <span className="font-medium text-slate-800">Global</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>0001 - GERENCIAMENTO E CONTROLE DA DÍVIDA PÚBLICA MUNICIPAL</p>
                    <p>3.2.90.21.00 - Juros sobre a Dívida por Contrato</p>
                    <p>1500000000 - Recursos não vinculados de Impostos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Históricos Padrões */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800">Históricos Padrões</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Consultar Históricos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowItemsModal(true)}
            className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Informar Itens
          </Button>
          <Button 
            variant="outline" 
            className="h-12 px-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
          >
            Cancelar
          </Button>
          <Button 
            className="h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          > Salvar o DID
          </Button>
        </div>
      </div>
 {/* Modal de Inclusão de Itens */}
      <Dialog open={showItemsModal} onOpenChange={setShowItemsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Package className="h-6 w-6 text-blue-600" />
              <span>Inclusão de Itens - DID</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <StepIndicator step={1} currentStep={currentStep} />
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Identificação
                </span>
              </div>
              <div className="w-12 h-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <StepIndicator step={2} currentStep={currentStep} />
                <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Quantidades
                </span>
              </div>
              <div className="w-12 h-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <StepIndicator step={3} currentStep={currentStep} />
                <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Confirmação
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Identificação do Item</CardTitle>
                    <p className="text-sm text-slate-600">Informe o código e descrição do item</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="codigo" className="text-sm font-semibold text-slate-700">
                          Código do Item *
                        </Label>
                        <div className="relative">
                          <Input
                            id="codigo"
                            value={currentItem.codigo || ''}
                            onChange={(e) => handleItemChange('codigo', e.target.value)}
                            className="h-12 pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                            placeholder="Ex: 001.001.001"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700">Unidade</Label>
                        <Select 
                          value={currentItem.unidade || 'UN'} 
                          onValueChange={(value) => handleItemChange('unidade', value)}
                        >
                          <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UN">Unidade</SelectItem>
                            <SelectItem value="KG">Quilograma</SelectItem>
                            <SelectItem value="M">Metro</SelectItem>
                            <SelectItem value="M2">Metro Quadrado</SelectItem>
                            <SelectItem value="M3">Metro Cúbico</SelectItem>
                            <SelectItem value="L">Litro</SelectItem>
                            <SelectItem value="CX">Caixa</SelectItem>
                            <SelectItem value="PC">Peça</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricaoItem" className="text-sm font-semibold text-slate-700">
                        Descrição do Item *
                      </Label>
                      <Textarea
                        id="descricaoItem"
                        value={currentItem.descricao || ''}
                        onChange={(e) => handleItemChange('descricao', e.target.value)}
                        className="min-h-[100px] border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                        placeholder="Descreva detalhadamente o item a ser adquirido..."
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Dica:</p>
                          <p>Use o botão de busca para localizar itens já cadastrados no sistema ou digite manualmente as informações do novo item.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Quantidades e Valores</CardTitle>
                    <p className="text-sm text-slate-600">Defina a quantidade e valor unitário do item</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Package className="h-4 w-4 text-slate-600" />
                        <span className="font-medium text-slate-800">{currentItem.codigo}</span>
                      </div>
                      <p className="text-sm text-slate-600">{currentItem.descricao}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="quantidade" className="text-sm font-semibold text-slate-700">
                          Quantidade *
                        </Label>
                        <Input
                          id="quantidade"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.quantidade || ''}
                          onChange={(e) => handleItemChange('quantidade', parseFloat(e.target.value) || 0)}
                          className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="0,00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="valorUnitario" className="text-sm font-semibold text-slate-700">
                          Valor Unitário (R$) *
                        </Label>
                        <Input
                          id="valorUnitario"
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.valorUnitario || ''}
                          onChange={(e) => handleItemChange('valorUnitario', parseFloat(e.target.value) || 0)}
                          className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-700 mb-1">Valor Total do Item</p>
                          <p className="text-xs text-blue-600">
                            {currentItem.quantidade || 0} {currentItem.unidade || 'UN'} × {formatCurrencyDisplay(currentItem.valorUnitario || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-800">
                            {formatCurrencyDisplay(currentItem.valorTotal || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Confirmação do Item</CardTitle>
                    <p className="text-sm text-slate-600">Revise as informações antes de adicionar o item</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Código</p>
                            <p className="font-medium text-slate-800">{currentItem.codigo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Unidade</p>
                            <p className="font-medium text-slate-800">{currentItem.unidade}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Quantidade</p>
                            <p className="font-medium text-slate-800">{currentItem.quantidade}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Valor Unitário</p>
                            <p className="font-medium text-slate-800">{formatCurrencyDisplay(currentItem.valorUnitario || 0)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Valor Total</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrencyDisplay(currentItem.valorTotal || 0)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Descrição</p>
                        <p className="text-sm text-slate-700">{currentItem.descricao}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <p className="font-medium mb-1">Pronto para adicionar!</p>
                          <p>Clique em Adicionar Item para incluir este item na lista do DID.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowItemsModal(false);
                    resetItemForm();
                  }}
                  className="h-10 px-6"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  onClick={resetItemForm}
                  className="h-10 px-6"
                >
                  Limpar Formulário
                </Button>
              </div>

              <div className="flex space-x-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="h-10 px-6"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!currentItem.codigo || !currentItem.descricao)) ||
                      (currentStep === 2 && (!currentItem.quantidade || !currentItem.valorUnitario))
                    }
                    className="h-10 px-6"
                  >
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      addItem();
                     resetItemForm();
                    }}
                    className="h-10 px-6 bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}