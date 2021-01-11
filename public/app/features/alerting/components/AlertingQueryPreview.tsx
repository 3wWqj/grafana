import React, { FC, useMemo, useState } from 'react';
import { useObservable } from 'react-use';
import { css } from 'emotion';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GrafanaTheme } from '@grafana/data';
import { TabsBar, TabContent, Tab, useStyles, Table, Icon } from '@grafana/ui';
import { PanelQueryRunner } from '../../query/state/PanelQueryRunner';

enum Tabs {
  Query = 'query',
  Instance = 'instance',
}

const tabs = [
  { id: Tabs.Query, text: 'Query' },
  { id: Tabs.Instance, text: 'Alerting instance' },
];

interface Props {
  queryRunner: PanelQueryRunner;
}

export const AlertingQueryPreview: FC<Props> = ({ queryRunner }) => {
  const [activeTab, setActiveTab] = useState<string>(Tabs.Query);
  const styles = useStyles(getStyles);

  const observable = useMemo(() => queryRunner.getData({ withFieldConfig: true, withTransforms: true }), []);
  const data = useObservable(observable);
  return (
    <div className={styles.wrapper}>
      <TabsBar>
        {tabs.map((tab, index) => {
          return (
            <Tab
              key={`${tab.id}-${index}`}
              label={tab.text}
              onChangeTab={() => setActiveTab(tab.id)}
              active={activeTab === tab.id}
            />
          );
        })}
      </TabsBar>
      <TabContent className={styles.tabContent}>
        {data && data.series.length > 0 ? (
          <AutoSizer style={{ width: '100%', height: '100%' }}>
            {({ width, height }) => {
              switch (activeTab) {
                case Tabs.Instance:
                  return <div>Instance something something dark side</div>;

                case Tabs.Query:
                default:
                  return <Table data={data.series[0]} height={height} width={width} />;
              }
            }}
          </AutoSizer>
        ) : (
          <div className={styles.noQueries}>
            <h4 className={styles.noQueriesHeader}>No queries added.</h4>
            <div>Start adding queries to this alert and a visualisation for your queries will appear here.</div>
            <div>
              Learn more about how to create alert definitions <Icon name="external-link-alt" />
            </div>
          </div>
        )}
      </TabContent>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme) => {
  return {
    wrapper: css`
      label: alertDefinitionPreviewTabs;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: ${theme.spacing.md} 0 0 ${theme.spacing.md};
    `,
    tabContent: css`
      background: ${theme.colors.panelBg};
      flex: 1;
    `,
    noQueries: css`
      color: ${theme.colors.textSemiWeak};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    `,
    noQueriesHeader: css`
      color: ${theme.colors.textSemiWeak};
    `,
  };
};
