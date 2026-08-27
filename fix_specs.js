const fs = require('fs');

function fixSpec(file, searchStr) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('})\n    .compileComponents();')) {
    content = content.replace(/      \]\n    \.compileComponents\(\);/g, "      ]\n    })\n    .compileComponents();");
    content = content.replace(/      \],\n    \.compileComponents\(\);/g, "      ],\n    })\n    .compileComponents();");
    fs.writeFileSync(file, content);
  }
}

fixSpec('frontend/src/app/features/generator/components/generator-view/generator-view.component.spec.ts');
fixSpec('frontend/src/app/layout/components/sidebar/sidebar.component.spec.ts');
fixSpec('frontend/src/app/features/taller/components/taller-view/taller-view.component.spec.ts');

