import { UniversalTool } from '@/components/common/UniversalTool';
import { toolsConfig } from '@/data/tools-config';

export default function JSONPathTesterPage() {
  return (
    <UniversalTool 
      config={toolsConfig.jsonpathTester}
    />
  );
}
