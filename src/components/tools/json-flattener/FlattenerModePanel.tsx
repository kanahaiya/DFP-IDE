'use client';

import { useFlattenerStore } from '@/store/flattener';
import { getNotationTypes, getArrayStrategies } from '@/lib/flattener/converter';
import type { NotationType, ArrayStrategy } from '@/lib/flattener/converter';

export function FlattenerModePanel() {
  const { settings, updateSettings } = useFlattenerStore();
  const notationTypes = getNotationTypes();
  const arrayStrategies = getArrayStrategies();
  
  return (
    <div className="settings-panel-content">
      <div className="settings-group">
        <h3><i className="fas fa-key"></i> Key Notation</h3>
        
        <div className="form-row">
          <label htmlFor="notation">
            <i className="fas fa-ellipsis-h" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Notation Style
          </label>
          <select
            id="notation"
            value={settings.notation}
            onChange={(e) => updateSettings({ notation: e.target.value as NotationType })}
          >
            {notationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            Example: {notationTypes.find(t => t.value === settings.notation)?.example}
          </span>
        </div>
      </div>
      
      <div className="settings-group">
        <h3><i className="fas fa-list"></i> Array Handling</h3>
        
        <div className="form-row">
          <label htmlFor="arrayStrategy">
            <i className="fas fa-th-list" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
            Array Strategy
          </label>
          <select
            id="arrayStrategy"
            value={settings.arrayStrategy}
            onChange={(e) => updateSettings({ arrayStrategy: e.target.value as ArrayStrategy })}
          >
            {arrayStrategies.map((strategy) => (
              <option key={strategy.value} value={strategy.value}>
                {strategy.label}
              </option>
            ))}
          </select>
          <span className="form-hint">
            {arrayStrategies.find(s => s.value === settings.arrayStrategy)?.description}
          </span>
        </div>
        
        {settings.arrayStrategy === 'concatenate' && (
          <div className="form-row">
            <label htmlFor="concatenateDelimiter">
              <i className="fas fa-grip-lines-vertical" style={{ marginRight: '6px', opacity: 0.7, fontSize: '11px' }}></i>
              Concatenate With
            </label>
            <select
              id="concatenateDelimiter"
              value={settings.concatenateDelimiter}
              onChange={(e) => updateSettings({ concatenateDelimiter: e.target.value })}
            >
              <option value=",">Comma (,)</option>
              <option value=", ">Comma + Space (, )</option>
              <option value="|">Pipe (|)</option>
              <option value=";">Semicolon (;)</option>
              <option value=" ">Space</option>
            </select>
            <span className="form-hint">Delimiter for joining array values</span>
          </div>
        )}
      </div>
    </div>
  );
}
