import React, { PureComponent } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { NavModel } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Form } from '@grafana/ui';
import Page from 'app/core/components/Page/Page';
import { NotificationChannelForm } from './components/NotificationChannelForm';
import {
  defaultValues,
  selectableChannels,
  transformSubmitData,
  transformTestData,
} from './utils/notificationChannels';
import { getNavModel } from 'app/core/selectors/navModel';
import { createNotificationChannel, loadNotificationTypes, testNotificationChannel } from './state/actions';
import { NotificationChannelType, NotificationChannelDTO, StoreState } from '../../types';

interface OwnProps {}

interface ConnectedProps {
  navModel: NavModel;
  notificationChannelTypes: NotificationChannelType[];
}

interface DispatchProps {
  createNotificationChannel: typeof createNotificationChannel;
  loadNotificationTypes: typeof loadNotificationTypes;
  testNotificationChannel: typeof testNotificationChannel;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

class NewNotificationChannelPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.loadNotificationTypes();
  }

  onSubmit = (data: NotificationChannelDTO) => {
    this.props.createNotificationChannel(transformSubmitData(data));
  };

  onTestChannel = (data: NotificationChannelDTO) => {
    this.props.testNotificationChannel(transformTestData(data));
  };

  render() {
    const { navModel, notificationChannelTypes } = this.props;

    return (
      <Page navModel={navModel}>
        <Page.Contents>
          <h2>New Notification Channel</h2>
          <Form onSubmit={this.onSubmit} validateOn="onChange" defaultValues={defaultValues}>
            {({ register, errors, control, getValues, watch }) => {
              const selectedChannel = notificationChannelTypes.find(c => c.value === getValues().type.value);

              return (
                <NotificationChannelForm
                  selectableChannels={selectableChannels(notificationChannelTypes)}
                  selectedChannel={selectedChannel}
                  onTestChannel={this.onTestChannel}
                  register={register}
                  errors={errors}
                  getValues={getValues}
                  control={control}
                  watch={watch}
                  imageRendererAvailable={config.rendererAvailable}
                />
              );
            }}
          </Form>
        </Page.Contents>
      </Page>
    );
  }
}

const mapStateToProps: MapStateToProps<ConnectedProps, OwnProps, StoreState> = state => {
  return {
    navModel: getNavModel(state.navIndex, 'channels'),
    notificationChannelTypes: state.alertRules.notificationChannelTypes,
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  createNotificationChannel,
  loadNotificationTypes,
  testNotificationChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewNotificationChannelPage);
