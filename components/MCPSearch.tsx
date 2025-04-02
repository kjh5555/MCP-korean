import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MCPFilterOptions } from '@/lib/types';
import { mcpRoles, mcpFeatures } from '@/lib/data';

interface MCPSearchProps {
  onSearch: (filters: MCPFilterOptions) => void;
  initialFilters?: MCPFilterOptions;
}

export function MCPSearch({ onSearch, initialFilters = {} }: MCPSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [selectedRole, setSelectedRole] = useState(initialFilters.role || '');
  const [selectedFeature, setSelectedFeature] = useState(initialFilters.feature || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      search: searchTerm,
      role: selectedRole || undefined,
      feature: selectedFeature || undefined
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedFeature('');
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="MCP 이름 또는 설명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              역할별 필터링
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">모든 역할</option>
              {mcpRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              기능별 필터링
            </label>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="">모든 기능</option>
              {mcpFeatures.map(feature => (
                <option key={feature.id} value={feature.id}>
                  {feature.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button type="submit">검색</Button>
        </div>
      </form>
    </div>
  );
} 